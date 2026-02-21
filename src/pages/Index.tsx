import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ThreadTable } from "@/components/ThreadTable";
import { ThreadDetailModal } from "@/components/ThreadDetailModal";
import { fetchThreads, fetchThreadDetail } from "@/lib/mock-data";
import type { ThreadDetail } from "@/lib/types";

const Index = () => {
  const threads = useMemo(() => fetchThreads(), []);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSelectThread(threadId: string) {
    const detail = fetchThreadDetail(threadId);
    setSelectedThread(detail);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background dot-grid flex flex-col">
      <Header />
      <QuickActions />
      <main className="flex-1 overflow-auto">
        <ThreadTable threads={threads} onSelectThread={handleSelectThread} />
      </main>
      <ThreadDetailModal
        thread={selectedThread}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Index;
