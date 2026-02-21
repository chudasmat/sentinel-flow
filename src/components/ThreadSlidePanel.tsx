import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
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
  onClose: () => void;
  onExpand: () => void;
}

export function ThreadSlidePanel({ thread, onClose, onExpand }: Props) {
  if (!thread) return null;

  return (
    <div className="flex h-full">
      {/* Expand arrow on left border */}
      <button
        onClick={onExpand}
        className="flex items-center justify-center w-6 border-l border-border bg-secondary/30 hover:bg-secondary/60 transition-colors flex-shrink-0"
        title="Expand full workflow"
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Panel content */}
      <div className="flex-1 flex flex-col border-l border-border bg-background min-w-0">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider">
            THREAD: {thread.thread_id.substring(0, 12)}…
          </span>
          <button
            onClick={onClose}
            className="text-[10px] text-muted-foreground hover:text-foreground tracking-wider"
          >
            CLOSE
          </button>
        </div>

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
      </div>
    </div>
  );
}
