import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ThreadTable } from "@/components/ThreadTable";
import { ThreadSlidePanel } from "@/components/ThreadSlidePanel";
import { ThreadDetailModal } from "@/components/ThreadDetailModal";
import { fetchThreads, fetchThreadDetail } from "@/lib/api";
import type { ThreadDetail, ThreadSummary, ClassificationLabel } from "@/lib/types";

const Index = () => {
  const [allThreads, setAllThreads] = useState<ThreadSummary[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [labelFilters, setLabelFilters] = useState<ClassificationLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchThreads()
      .then((data) => {
        if (cancelled) return;
        setAllThreads(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load threads.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const threads = useMemo(() => {
    let filtered = allThreads;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.thread_id.toLowerCase().includes(q) ||
          t.first_message_preview.toLowerCase().includes(q)
      );
    }
    if (labelFilters.length > 0) {
      filtered = filtered.filter((t) => labelFilters.includes(t.classification_label));
    }
    return filtered;
  }, [allThreads, searchQuery, labelFilters]);

  function handleSelectThread(threadId: string) {
    setPanelOpen(true);
    setSelectedThread(null);
    fetchThreadDetail(threadId)
      .then((detail) => {
        setSelectedThread(detail);
      })
      .catch(() => {
        setSelectedThread(null);
      });
  }

  function handleExpand() {
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <QuickActions searchQuery={searchQuery} onSearchChange={setSearchQuery} labelFilters={labelFilters} onLabelFiltersChange={setLabelFilters} />
      <div className="flex-1 flex overflow-hidden">
        <main className={`overflow-auto transition-all ${panelOpen ? "w-[60%]" : "w-full"}`}>
          {error && (
            <div className="px-4 py-3 text-xs text-danger border-b border-danger/40 bg-danger/5">
              {error}
            </div>
          )}
          {loading ? (
            <div className="px-4 py-6 text-xs text-muted-foreground">Loading threads…</div>
          ) : (
            <ThreadTable threads={threads} onSelectThread={handleSelectThread} />
          )}
        </main>
        {panelOpen && selectedThread && (
          <aside className="w-[40%] flex-shrink-0">
            <ThreadSlidePanel
              thread={selectedThread}
              onClose={() => setPanelOpen(false)}
              onExpand={handleExpand}
            />
          </aside>
        )}
      </div>
      <ThreadDetailModal
        thread={selectedThread}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Index;
