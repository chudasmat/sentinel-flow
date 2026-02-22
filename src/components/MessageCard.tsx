import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { MessageDetail } from "@/lib/types";
import type { ClassifyResult } from "@/lib/api";
import { formatEpoch } from "@/lib/types";

interface Props {
  message: MessageDetail;
  classification?: ClassifyResult;
  index: number;
  isLast: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  system: "SYS",
  user: "USR",
  assistant: "AST",
  tool: "TL",
};

export function MessageCard({ message, classification, index, isLast }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex items-start gap-0">
      <div
        className="border border-border bg-card p-3 cursor-pointer hover:bg-secondary/50 transition-colors min-w-0"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-bold tracking-wider">
            [{ROLE_LABELS[message.role] || message.role}]
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {formatEpoch(message.created_at)}
          </span>
        </div>

        <p className="text-xs text-foreground leading-relaxed mb-2 line-clamp-3">
          {message.content}
        </p>

        {classification && (
          <Badge
            variant="outline"
            className="text-[9px] font-mono border-muted-foreground/50 text-muted-foreground"
          >
            {classification.label}
          </Badge>
        )}

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <div>
              <span className="text-[10px] text-muted-foreground">FULL CONTENT:</span>
              <p className="text-xs text-foreground mt-1 whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {message.reasoning_content && (
              <div>
                <span className="text-[10px] text-muted-foreground">REASONING:</span>
                <p className="text-xs text-foreground/70 mt-1">{message.reasoning_content}</p>
              </div>
            )}

            {classification && (
              <div>
                <span className="text-[10px] text-muted-foreground">PROBABILITIES:</span>
                <div className="mt-1 space-y-1">
                  {Object.entries(classification.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([label, prob]) => (
                      <div key={label} className="flex items-center gap-2 text-[10px]">
                        <span className="w-24 text-muted-foreground truncate">{label}</span>
                        <div className="flex-1 h-1.5 bg-secondary">
                          <div
                            className={`h-full ${label === "safe" ? "bg-safe/70" : "bg-danger/70"}`}
                            style={{ width: `${Math.min(prob * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground w-10 text-right">
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {message.metadata && (
              <div>
                <span className="text-[10px] text-muted-foreground">METADATA:</span>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {Object.entries(message.metadata).map(([k, v]) => (
                    <div key={k}>{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
