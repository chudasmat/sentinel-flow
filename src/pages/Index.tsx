import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ThreadTable } from "@/components/ThreadTable";
import { ThreadSlidePanel } from "@/components/ThreadSlidePanel";
import { ThreadDetailModal } from "@/components/ThreadDetailModal";
import { fetchThreads, fetchThreadDetail } from "@/lib/mock-data";
import type { ThreadDetail } from "@/lib/types";

const Index = () => {
  const allThreads = useMemo(() => fetchThreads(), []);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [labelFilter, setLabelFilter] = useState("all");

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
    if (labelFilter !== "all") {
      filtered = filtered.filter((t) => t.classification_label === labelFilter);
    }
    return filtered;
  }, [allThreads, searchQuery, labelFilter]);

  function handleSelectThread(threadId: string) {
    const detail = fetchThreadDetail(threadId);
    setSelectedThread(detail);
    setPanelOpen(true);
  }

  function handleExpand() {
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <QuickActions searchQuery={searchQuery} onSearchChange={setSearchQuery} labelFilter={labelFilter} onLabelFilterChange={setLabelFilter} />
      <div className="flex-1 flex overflow-hidden">
        <main className={`overflow-auto transition-all ${panelOpen ? "w-[60%]" : "w-full"}`}>
          <ThreadTable threads={threads} onSelectThread={handleSelectThread} />
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
