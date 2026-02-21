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
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <QuickActions />
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
