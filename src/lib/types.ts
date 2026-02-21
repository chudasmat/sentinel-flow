// Types matching the OpenAPI schema for antislopfactory

export const CLASSIFICATION_LABELS = [
  "criminal", "deception", "fraud", "harassment", "harmful", "hate",
  "illegal", "malware", "privacy", "professional_advice", "safe",
  "self_harm", "sexual", "unethical", "unsafe_other", "violence",
] as const;

export type ClassificationLabel = typeof CLASSIFICATION_LABELS[number];

export const UNSAFE_LABELS: ClassificationLabel[] = [
  "criminal", "deception", "fraud", "harassment", "harmful", "hate",
  "illegal", "malware", "privacy", "self_harm", "sexual",
  "unethical", "unsafe_other", "violence",
];

export interface ClassificationProbabilities {
  label: ClassificationLabel;
  probability: number;
}

export interface MessageDetail {
  id: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  reasoning_content?: string;
  classification_label: ClassificationLabel;
  risk_score: number;
  probabilities: ClassificationProbabilities[];
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface ThreadSummary {
  thread_id: string;
  first_message_preview: string;
  risk_score: number;
  classification_label: ClassificationLabel;
  top_probabilities: ClassificationProbabilities[];
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ThreadDetail {
  thread_id: string;
  messages: MessageDetail[];
  taint_log: TaintLogEntry[];
}

export interface TaintLogEntry {
  timestamp: string;
  message_id: string;
  event: string;
  label: ClassificationLabel;
  score: number;
}

export function getRiskColor(score: number): "safe" | "hazard" | "danger" {
  if (score <= 3) return "safe";
  if (score <= 6) return "hazard";
  return "danger";
}

export function getRiskColorClass(score: number): string {
  const c = getRiskColor(score);
  if (c === "safe") return "text-safe";
  if (c === "hazard") return "text-hazard";
  return "text-danger";
}

export function getRiskGlowClass(score: number): string {
  const c = getRiskColor(score);
  if (c === "safe") return "glow-safe";
  if (c === "hazard") return "glow-hazard";
  return "glow-danger";
}

export function getRiskBorderClass(score: number): string {
  const c = getRiskColor(score);
  if (c === "safe") return "border-safe";
  if (c === "hazard") return "border-hazard";
  return "border-danger";
}
