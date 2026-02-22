import type {
  ThreadSummary,
  ThreadDetail,
  MessageDetail,
  ClassificationLabel,
  ClassificationProbabilities,
} from "./types";
import { CLASSIFICATION_LABELS } from "./types";

const API_BASE = "http://bastion.iammik.us";

type ApiThreadSummary = {
  thread_id: string;
  risk: number;
  risk_score: number;
  peak_risk: number;
  first_user_message: string | null;
  created_at: number;
  updated_at: number;
};

type ApiListThreadsResponse = {
  threads: ApiThreadSummary[];
};

type ApiMessageDetail = {
  id: number;
  seq: number;
  role: string;
  content: string;
  reasoning_content: string;
  metadata: Record<string, unknown> | null;
  embedding: number[] | null;
  created_at: number;
  risk_score?: number;
  risk?: number;
  classification_label?: string;
  label?: string;
  probabilities?: unknown;
};

type ApiThreadMessagesResponse = {
  thread_id: string;
  risk: number;
  risk_score: number;
  peak_risk: number;
  created_at: number;
  updated_at: number;
  messages: ApiMessageDetail[];
};

const threadDetailCache = new Map<string, ThreadDetail>();
const threadMessageCountCache = new Map<string, number>();
const LABEL_SET = new Set<string>(CLASSIFICATION_LABELS);

function toIsoTimestamp(epoch: number): string {
  if (!Number.isFinite(epoch)) return new Date().toISOString();
  const ms = epoch > 1_000_000_000_000 ? epoch : epoch * 1000;
  return new Date(ms).toISOString();
}

function labelFromRiskScore(score: number): ClassificationLabel {
  if (score <= 3) return "safe";
  if (score <= 6) return "professional_advice";
  return "unsafe_other";
}

function probabilitiesFromLabel(label: ClassificationLabel): ClassificationProbabilities[] {
  if (label === "safe") {
    return [
      { label: "safe", probability: 0.92 },
      { label: "professional_advice", probability: 0.05 },
      { label: "unsafe_other", probability: 0.03 },
    ];
  }
  if (label === "professional_advice") {
    return [
      { label: "professional_advice", probability: 0.72 },
      { label: "safe", probability: 0.18 },
      { label: "unsafe_other", probability: 0.10 },
    ];
  }
  return [
    { label: "unsafe_other", probability: 0.75 },
    { label: "professional_advice", probability: 0.15 },
    { label: "safe", probability: 0.10 },
  ];
}

function isClassificationLabel(value: unknown): value is ClassificationLabel {
  return typeof value === "string" && LABEL_SET.has(value);
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeProbabilityEntries(input: unknown): ClassificationProbabilities[] | undefined {
  if (Array.isArray(input)) {
    const parsed = input
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const obj = entry as Record<string, unknown>;
        const label = obj.label;
        const probability = toNumber(obj.probability);
        if (!isClassificationLabel(label) || typeof probability !== "number") return null;
        return { label, probability };
      })
      .filter((p): p is ClassificationProbabilities => p !== null)
      .sort((a, b) => b.probability - a.probability);
    return parsed.length > 0 ? parsed : undefined;
  }

  if (input && typeof input === "object") {
    const parsed = Object.entries(input as Record<string, unknown>)
      .map(([label, probability]) => {
        const parsedProbability = toNumber(probability);
        if (!isClassificationLabel(label) || typeof parsedProbability !== "number") return null;
        return { label, probability: parsedProbability };
      })
      .filter((p): p is ClassificationProbabilities => p !== null)
      .sort((a, b) => b.probability - a.probability);
    return parsed.length > 0 ? parsed : undefined;
  }

  return undefined;
}

function getNestedRecord(metadata: Record<string, unknown> | null, key: string): Record<string, unknown> | null {
  if (!metadata) return null;
  const value = metadata[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function getNumericMessageRisk(msg: ApiMessageDetail): number | undefined {
  const directRiskScore = toNumber(msg.risk_score);
  if (typeof directRiskScore === "number") return directRiskScore;
  const directRisk = toNumber(msg.risk);
  if (typeof directRisk === "number") return directRisk;

  const metadata = msg.metadata;
  if (!metadata) return undefined;
  const metadataRiskScore = toNumber(metadata.risk_score);
  if (typeof metadataRiskScore === "number") return metadataRiskScore;
  const metadataRisk = toNumber(metadata.risk);
  if (typeof metadataRisk === "number") return metadataRisk;

  const cls = getNestedRecord(metadata, "classification");
  if (cls) {
    const nestedRisk = toNumber(cls.risk_score);
    if (typeof nestedRisk === "number") return nestedRisk;
  }
  return undefined;
}

function getMessageLabel(msg: ApiMessageDetail, fallbackRisk: number): ClassificationLabel {
  if (isClassificationLabel(msg.classification_label)) return msg.classification_label;
  if (isClassificationLabel(msg.label)) return msg.label;

  const metadata = msg.metadata;
  if (metadata) {
    if (isClassificationLabel(metadata.classification_label)) return metadata.classification_label;
    if (isClassificationLabel(metadata.label)) return metadata.label;
    const cls = getNestedRecord(metadata, "classification");
    if (cls && isClassificationLabel(cls.label)) return cls.label;
    if (cls && isClassificationLabel(cls.classification_label)) return cls.classification_label;
  }

  return labelFromRiskScore(fallbackRisk);
}

function getMessageProbabilities(msg: ApiMessageDetail, labelFallback: ClassificationLabel): ClassificationProbabilities[] {
  const direct = normalizeProbabilityEntries(msg.probabilities);
  if (direct) return direct;

  const metadata = msg.metadata;
  if (metadata) {
    const metaDirect =
      normalizeProbabilityEntries(metadata.probabilities) ??
      normalizeProbabilityEntries(metadata.classification_probabilities) ??
      normalizeProbabilityEntries(metadata.scores);
    if (metaDirect) return metaDirect;

    const cls = getNestedRecord(metadata, "classification");
    if (cls) {
      const nested = normalizeProbabilityEntries(cls.probabilities) ?? normalizeProbabilityEntries(cls.scores);
      if (nested) return nested;
    }
  }

  return probabilitiesFromLabel(labelFallback);
}

function normalizeMetadata(metadata: Record<string, unknown> | null): Record<string, string> | undefined {
  if (!metadata) return undefined;
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    normalized[key] = typeof value === "string" ? value : JSON.stringify(value);
  }
  return normalized;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function mapThreadSummary(thread: ApiThreadSummary): ThreadSummary {
  const label = labelFromRiskScore(thread.risk_score ?? 0);
  const probabilities = probabilitiesFromLabel(label);
  return {
    thread_id: thread.thread_id,
    first_message_preview: thread.first_user_message ?? "—",
    risk_score: thread.risk_score ?? 0,
    classification_label: label,
    top_probabilities: probabilities.slice(0, 3),
    message_count: threadMessageCountCache.get(thread.thread_id) ?? 0,
    created_at: toIsoTimestamp(thread.created_at),
    updated_at: toIsoTimestamp(thread.updated_at),
  };
}

function mapThreadDetail(response: ApiThreadMessagesResponse): ThreadDetail {
  const messages: MessageDetail[] = response.messages.map((msg) => ({
    id: String(msg.id),
    role: msg.role === "system" || msg.role === "user" || msg.role === "assistant" || msg.role === "tool"
      ? msg.role
      : "assistant",
    content: msg.content,
    reasoning_content: msg.reasoning_content || undefined,
    timestamp: toIsoTimestamp(msg.created_at),
    metadata: normalizeMetadata(msg.metadata),
    ...(() => {
      const riskScore = getNumericMessageRisk(msg) ?? response.risk_score ?? 0;
      const classificationLabel = getMessageLabel(msg, riskScore);
      const probabilities = getMessageProbabilities(msg, classificationLabel);
      return {
        classification_label: classificationLabel,
        risk_score: riskScore,
        probabilities,
      };
    })(),
  }));

  return {
    thread_id: response.thread_id,
    messages,
    taint_log: [],
  };
}

export async function fetchThreads(): Promise<ThreadSummary[]> {
  const list = await apiGet<ApiListThreadsResponse>("/threads");

  await Promise.all(
    list.threads.map(async (thread) => {
      if (threadMessageCountCache.has(thread.thread_id)) return;
      try {
        const detail = await apiGet<ApiThreadMessagesResponse>(`/threads/${thread.thread_id}/messages`);
        threadMessageCountCache.set(thread.thread_id, detail.messages.length);
        if (!threadDetailCache.has(thread.thread_id)) {
          threadDetailCache.set(thread.thread_id, mapThreadDetail(detail));
        }
      } catch {
        threadMessageCountCache.set(thread.thread_id, 0);
      }
    })
  );

  return list.threads.map(mapThreadSummary);
}

export async function fetchThreadDetail(threadId: string): Promise<ThreadDetail | null> {
  if (threadDetailCache.has(threadId)) {
    return threadDetailCache.get(threadId) ?? null;
  }
  const detail = await apiGet<ApiThreadMessagesResponse>(`/threads/${threadId}/messages`);
  const mapped = mapThreadDetail(detail);
  threadDetailCache.set(threadId, mapped);
  threadMessageCountCache.set(threadId, mapped.messages.length);
  return mapped;
}
