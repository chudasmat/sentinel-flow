import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { MessageCard } from "@/components/MessageCard";
import { TaintLog } from "@/components/TaintLog";
import type { ThreadDetail } from "@/lib/types";

interface Props {
  thread: ThreadDetail | null;
  open: boolean;
  onClose: () => void;
}

export function ThreadDetailModal({ thread, open, onClose }: Props) {
  if (!thread) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 border-border bg-background">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle className="text-xs font-mono tracking-wider">
            THREAD: {thread.thread_id} — {thread.messages.length} MESSAGES
          </DialogTitle>
        </DialogHeader>

        {/* Snaking workflow grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-1 items-start">
            {thread.messages.map((msg, i) => (
              <MessageCard
                key={msg.id}
                message={msg}
                index={i}
                isLast={i === thread.messages.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Taint log at bottom */}
        <TaintLog entries={thread.taint_log} />
      </DialogContent>
    </Dialog>
  );
}
