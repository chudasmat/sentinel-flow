import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { QuickActions } from "@/components/QuickActions";
import { ThreadTable } from "@/components/ThreadTable";
import { ThreadSlidePanel } from "@/components/ThreadSlidePanel";
import { ThreadWorkflowPanel } from "@/components/ThreadWorkflowPanel";
import { fetchThreads, fetchThreadDetail } from "@/lib/mock-data";
import type { ThreadDetail } from "@/lib/types";

type PanelMode = "closed" | "condensed" | "expanded";

const Index = () => {
  const threads = useMemo(() => fetchThreads(), []);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("closed");

  function handleSelectThread(threadId: string) {
    const detail = fetchThreadDetail(threadId);
    setSelectedThread(detail);
    setPanelMode("condensed");
  }

  function handleClose() {
    setPanelMode("closed");
  }

  const tableWidth = panelMode === "closed" ? "w-full" : panelMode === "condensed" ? "w-[60%]" : "w-[30%]";
  const panelWidth = panelMode === "condensed" ? "w-[40%]" : "w-[70%]";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <QuickActions />
      <div className="flex-1 flex overflow-hidden">
        <main className={`overflow-auto transition-all ${tableWidth}`}>
          <ThreadTable threads={threads} onSelectThread={handleSelectThread} />
        </main>
        {panelMode !== "closed" && selectedThread && (
          <aside className={`flex-shrink-0 transition-all ${panelWidth}`}>
            {panelMode === "condensed" ? (
              <ThreadSlidePanel
                thread={selectedThread}
                onClose={handleClose}
                onExpand={() => setPanelMode("expanded")}
              />
            ) : (
              <ThreadWorkflowPanel
                thread={selectedThread}
                onCollapse={handleClose}
              />
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default Index;
