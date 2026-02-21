import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { MessageCard } from "@/components/MessageCard";
import { TaintLog } from "@/components/TaintLog";
import type { ThreadDetail } from "@/lib/types";

function ArrowRight() {
  return (
    <svg width="40" height="20" viewBox="0 0 40 20" className="text-muted-foreground/60">
      <line x1="0" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="2" />
      <polygon points="28,4 40,10 28,16" fill="currentColor" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="40" height="20" viewBox="0 0 40 20" className="text-muted-foreground/60">
      <line x1="12" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="2" />
      <polygon points="12,4 0,10 12,16" fill="currentColor" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="20" height="32" viewBox="0 0 20 32" className="text-muted-foreground/60">
      <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="2" />
      <polygon points="4,20 10,32 16,20" fill="currentColor" />
    </svg>
  );
}

interface Props {
  thread: ThreadDetail | null;
  open: boolean;
  onClose: () => void;
}

const CARDS_PER_ROW = 3;

export function ThreadDetailModal({ thread, open, onClose }: Props) {
  if (!thread) return null;

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
                        {!isLastInRow && (
                          <div className="flex items-center self-center mx-1">
                            {isEvenRow ? <ArrowRight /> : <ArrowLeft />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isLastRow && (
                  <div className={`flex ${isEvenRow ? "justify-end pr-[7.5rem]" : "justify-start pl-[7.5rem]"} py-1`}>
                    <ArrowDown />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        
      </DialogContent>
    </Dialog>
  );
}
