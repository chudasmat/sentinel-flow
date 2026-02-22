import { supabase } from "@/integrations/supabase/client";
import type { ThreadSummary, ThreadMessagesResponse } from "./types";

async function bastionGet(path: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke("bastion-proxy", {
    body: { path },
    method: "POST",
  });
  if (error) throw new Error(`Proxy error: ${error.message}`);
  return data;
}

async function bastionPost(path: string, body: unknown): Promise<any> {
  // We pass the bastion path + body through our proxy
  const { data, error } = await supabase.functions.invoke("bastion-proxy", {
    body: { path, payload: body },
    method: "POST",
  });
  if (error) throw new Error(`Proxy error: ${error.message}`);
  return data;
}

export async function fetchThreads(): Promise<ThreadSummary[]> {
  const data = await bastionGet("/threads");
  return data.threads;
}

export async function fetchThreadMessages(threadId: string): Promise<ThreadMessagesResponse> {
  return bastionGet(`/threads/${threadId}/messages`);
}

export interface ClassifyResult {
  text: string;
  label: string;
  probabilities: Record<string, number>;
}

export async function classifyTexts(texts: string[]): Promise<ClassifyResult[]> {
  const data = await bastionPost("/classify", { text: texts });
  return data.results;
}

export async function fetchHealth(): Promise<{ status: string; model_loaded: boolean }> {
  return bastionGet("/health");
}
