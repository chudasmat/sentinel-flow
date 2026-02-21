import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { MessageCard } from "@/components/MessageCard";
import { TaintLog } from "@/components/TaintLog";
import type { ThreadDetail } from "@/lib/types";
import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";

interface Props {
  thread: ThreadDetail | null;
  open: boolean;
  onClose: () => void;
}

const CARDS_PER_ROW = 3;

export function ThreadDetailModal({ thread, open, onClose }: Props) {
  if (!thread) return null;

  // Split messages into rows
  const rows: typeof thread.messages[] = [];
  for (let i = 0; i < thread.messages.length; i += CARDS_PER_ROW) {
    rows.push(thread.messages.slice(i, i + CARDS_PER_ROW));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 border-border bg-background">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle className="text-xs font-mono tracking-wider">
            THREAD: {thread.thread_id} — {thread.messages.length} MESSAGES
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {rows.map((row, rowIndex) => {
            const isEvenRow = rowIndex % 2 === 0;
            const displayRow = isEvenRow ? row : [...row].reverse();
            const isLastRow = rowIndex === rows.length - 1;

            return (
              <div key={rowIndex}>
                {/* Row of cards */}
                <div className={`flex items-start gap-0 ${isEvenRow ? "justify-start" : "justify-end"}`}>
                  {displayRow.map((msg, i) => {
                    const globalIndex = rowIndex * CARDS_PER_ROW + (isEvenRow ? i : row.length - 1 - i);
                    const isLastInRow = i === displayRow.length - 1;
                    const isLastMessage = globalIndex === thread.messages.length - 1;

                    return (
                      <div key={msg.id} className="flex items-start gap-0">
                        <MessageCard
                          message={msg}
                          index={globalIndex}
                          isLast={isLastMessage}
                        />
                        {/* Horizontal arrow between cards in the same row */}
                        {!isLastInRow && (
                          <div className="flex items-center self-center -mx-0.5">
                            {isEvenRow ? (
                              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                            ) : (
                              <ChevronLeft className="w-4 h-4 text-muted-foreground/40" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Down arrow between rows */}
                {!isLastRow && (
                  <div className={`flex ${isEvenRow ? "justify-end pr-[7.5rem]" : "justify-start pl-[7.5rem]"} py-1`}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <TaintLog entries={thread.taint_log} />
      </DialogContent>
    </Dialog>
  );
}
