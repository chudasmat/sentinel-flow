import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ThreadTable } from "@/components/ThreadTable";
import { ThreadSlidePanel } from "@/components/ThreadSlidePanel";
import { ThreadDetailModal } from "@/components/ThreadDetailModal";
import { fetchThreads, fetchThreadMessages, classifyTexts } from "@/lib/api";
import type { ClassifyResult } from "@/lib/api";
import type { ThreadMessagesResponse } from "@/lib/types";

const Index = () => {
  const { data: allThreads = [], isLoading, error } = useQuery({
    queryKey: ["threads"],
    queryFn: fetchThreads,
    refetchInterval: 30000,
  });

  const [selectedThread, setSelectedThread] = useState<ThreadMessagesResponse | null>(null);
  const [classifications, setClassifications] = useState<Map<number, ClassifyResult>>(new Map());
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const threads = useMemo(() => {
    if (!searchQuery.trim()) return allThreads;
    const q = searchQuery.toLowerCase();
    return allThreads.filter(
      (t) =>
        t.thread_id.toLowerCase().includes(q) ||
        (t.first_user_message || "").toLowerCase().includes(q)
    );
  }, [allThreads, searchQuery]);

  async function handleSelectThread(threadId: string) {
    try {
      const detail = await fetchThreadMessages(threadId);
      setSelectedThread(detail);
      setPanelOpen(true);

      // Classify all message contents
      const texts = detail.messages.map((m) => m.content);
      if (texts.length > 0) {
        const results = await classifyTexts(texts);
        const map = new Map<number, ClassifyResult>();
        detail.messages.forEach((m, i) => {
          if (results[i]) map.set(m.id, results[i]);
        });
        setClassifications(map);
      }
    } catch (err) {
      console.error("Failed to load thread:", err);
    }
  }

  function handleExpand() {
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <QuickActions searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex-1 flex overflow-hidden">
        <main className={`overflow-auto transition-all ${panelOpen ? "w-[60%]" : "w-full"}`}>
          {isLoading && (
            <div className="p-8 text-xs text-muted-foreground font-mono">Loading threads…</div>
          )}
          {error && (
            <div className="p-8 text-xs text-danger font-mono">
              ERROR: {error instanceof Error ? error.message : "Failed to fetch threads"}
            </div>
          )}
          {!isLoading && !error && (
            <ThreadTable threads={threads} onSelectThread={handleSelectThread} />
          )}
        </main>
        {panelOpen && selectedThread && (
          <aside className="w-[40%] flex-shrink-0">
            <ThreadSlidePanel
              thread={selectedThread}
              classifications={classifications}
              onClose={() => setPanelOpen(false)}
              onExpand={handleExpand}
            />
          </aside>
        )}
      </div>
      <ThreadDetailModal
        thread={selectedThread}
        classifications={classifications}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Index;
