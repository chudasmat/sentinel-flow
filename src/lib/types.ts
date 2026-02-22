// Types matching the Bastion OpenAPI schema

export interface ThreadSummary {
  thread_id: string;
  risk: number;
  risk_score: number;
  peak_risk: number;
  first_user_message: string | null;
  created_at: number;
  updated_at: number;
}

export interface MessageDetail {
  id: number;
  seq: number;
  role: string;
  content: string;
  reasoning_content: string;
  metadata?: Record<string, unknown> | null;
  embedding?: number[] | null;
  created_at: number;
}

export interface ThreadMessagesResponse {
  thread_id: string;
  risk: number;
  risk_score: number;
  peak_risk: number;
  created_at: number;
  updated_at: number;
  messages: MessageDetail[];
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

export function getRiskLabel(score: number): string {
  const c = getRiskColor(score);
  if (c === "safe") return "SAFE";
  if (c === "hazard") return "CAUTION";
  return "DANGER";
}

export function formatEpoch(epoch: number): string {
  return new Date(epoch * 1000).toLocaleTimeString("en-US", {
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}
