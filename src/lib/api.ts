import type { ThreadSummary, ThreadMessagesResponse } from "./types";

const BASE_URL = "http://bastion.iammik.us";

export async function fetchThreads(): Promise<ThreadSummary[]> {
  const res = await fetch(`${BASE_URL}/threads`);
  if (!res.ok) throw new Error(`Failed to fetch threads: ${res.status}`);
  const data = await res.json();
  return data.threads;
}

export async function fetchThreadMessages(threadId: string): Promise<ThreadMessagesResponse> {
  const res = await fetch(`${BASE_URL}/threads/${threadId}/messages`);
  if (!res.ok) throw new Error(`Failed to fetch thread messages: ${res.status}`);
  return res.json();
}

export async function fetchHealth(): Promise<{ status: string; model_loaded: boolean }> {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
