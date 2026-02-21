import { Badge } from "@/components/ui/badge";
import { Maximize2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ThreadDetail } from "@/lib/types";
import { getRiskColorClass } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  system: "SYS",
  user: "USR",
  assistant: "AST",
  tool: "TL",
};

interface Props {
  thread: ThreadDetail | null;
  open: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export function ThreadSlidePanel({ thread, open, onClose, onExpand }: Props) {
  if (!thread) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="p-0 flex flex-col bg-background border-border sm:max-w-md">
        <SheetHeader className="px-4 py-3 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-xs font-mono tracking-wider">
            THREAD: {thread.thread_id.substring(0, 12)}…
          </SheetTitle>
          <button
            onClick={onExpand}
            className="text-muted-foreground hover:text-foreground transition-colors mr-8"
            title="Expand full workflow"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {thread.messages.map((msg, i) => {
            const borderColor = msg.classification_label === "safe"
              ? "border-l-safe/40"
              : msg.risk_score > 6
              ? "border-l-danger/60"
              : "border-l-hazard/50";

            return (
              <div
                key={msg.id}
                className={`border-b border-border border-l-2 ${borderColor} px-4 py-3 hover:bg-secondary/30 transition-colors`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-bold tracking-wider">
                      [{ROLE_LABELS[msg.role]}]
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      #{i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-mono ${
                        msg.classification_label === "safe"
                          ? "border-safe/50 text-safe"
                          : msg.risk_score > 6
                          ? "border-danger/50 text-danger"
                          : "border-hazard/50 text-hazard"
                      }`}
                    >
                      {msg.classification_label}
                    </Badge>
                    <span className={`text-xs font-bold ${getRiskColorClass(msg.risk_score)}`}>
                      {msg.risk_score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                  {msg.content}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground tracking-wider">
          {thread.messages.length} MESSAGES
        </div>
      </SheetContent>
    </Sheet>
  );
}
