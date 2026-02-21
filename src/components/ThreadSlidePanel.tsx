import { useState } from "react";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!thread) return null;

  return (
    <div className="flex flex-col h-full border-l border-border bg-background">
      {/* Header */}
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

      {/* Message list with expand arrow */}
      <div className="flex-1 relative">
        {/* Semi-circle expand button on the left edge */}
        <button
          onClick={onExpand}
          className="absolute top-1/2 -translate-y-1/2 -left-[1px] z-10 w-[22px] h-11 rounded-l-full bg-secondary border border-r-0 border-border flex items-center justify-center hover:bg-accent transition-colors"
          title="Expand full workflow"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground -ml-0.5" />
        </button>

        <div className="h-full overflow-y-auto min-w-0">
          {thread.messages.map((msg, i) => {
            const borderColor = msg.classification_label === "safe"
              ? "border-l-safe/40"
              : msg.risk_score > 6
              ? "border-l-danger/60"
              : "border-l-hazard/50";
            const isExpanded = expandedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`border-b border-border border-l-2 ${borderColor} px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer`}
                onClick={() => setExpandedId(isExpanded ? null : msg.id)}
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
                <p className={`text-xs text-foreground/80 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {msg.content}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground">PROBABILITIES:</span>
                      <div className="mt-1 space-y-1">
                        {msg.probabilities.slice(0, 5).map((p) => (
                          <div key={p.label} className="flex items-center gap-2 text-[10px]">
                            <span className="w-24 text-muted-foreground truncate">{p.label}</span>
                            <div className="flex-1 h-1.5 bg-secondary">
                              <div
                                className={`h-full ${
                                  p.label === "safe" ? "bg-safe/70" : "bg-danger/70"
                                }`}
                                style={{ width: `${Math.min(p.probability * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground w-10 text-right">
                              {(p.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {msg.metadata && (
                      <div>
                        <span className="text-[10px] text-muted-foreground">METADATA:</span>
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {Object.entries(msg.metadata).map(([k, v]) => (
                            <div key={k}>{k}: {v}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground tracking-wider">
        {thread.messages.length} MESSAGES
      </div>
    </div>
  );
}
