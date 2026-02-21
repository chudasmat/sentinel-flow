import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ThreadTable } from "@/components/ThreadTable";
import { ThreadSlidePanel } from "@/components/ThreadSlidePanel";
import { ThreadDetailModal } from "@/components/ThreadDetailModal";
import { fetchThreads, fetchThreadDetail } from "@/lib/mock-data";
import type { ThreadDetail } from "@/lib/types";

const Index = () => {
  const threads = useMemo(() => fetchThreads(), []);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSelectThread(threadId: string) {
    const detail = fetchThreadDetail(threadId);
    setSelectedThread(detail);
    setPanelOpen(true);
  }

  function handleExpand() {
    setPanelOpen(false);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <QuickActions />
      <main className="flex-1 overflow-auto">
        <ThreadTable threads={threads} onSelectThread={handleSelectThread} />
      </main>
      <ThreadSlidePanel
        thread={selectedThread}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onExpand={handleExpand}
      />
      <ThreadDetailModal
        thread={selectedThread}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Index;
