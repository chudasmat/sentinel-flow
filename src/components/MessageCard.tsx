import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { MessageDetail } from "@/lib/types";

interface Props {
  message: MessageDetail;
  defaultExpanded?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  system: "SYS",
  user: "USR",
  assistant: "AST",
  tool: "TL",
};

export function MessageCard({ message, defaultExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const borderColor = message.classification_label === "safe"
    ? "border-safe/40"
    : message.risk_score > 6
    ? "border-danger/60"
    : "border-hazard/50";

  return (
    <div className="flex items-start gap-0">
      <div
        className={`border ${borderColor} bg-card p-3 cursor-pointer hover:bg-secondary/50 transition-colors min-w-0`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-bold tracking-wider">
            [{ROLE_LABELS[message.role]}]
          </span>
        </div>

        {/* Content preview */}
        <p className="text-xs text-foreground leading-relaxed mb-2 line-clamp-3">
          {message.content}
        </p>

        {/* Label */}
        <Badge
          variant="outline"
          className={`text-[9px] font-mono ${
            message.classification_label === "safe"
              ? "border-safe/50 text-safe"
              : message.risk_score > 6
              ? "border-danger/50 text-danger"
              : "border-hazard/50 text-hazard"
          }`}
        >
          {message.classification_label}
        </Badge>

        {/* Expanded content */}
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

            <div>
              <span className="text-[10px] text-muted-foreground">PROBABILITIES:</span>
              <div className="mt-1 space-y-1">
                {message.probabilities.slice(0, 5).map((p) => (
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

            {message.metadata && (
              <div>
                <span className="text-[10px] text-muted-foreground">METADATA:</span>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  <div>moonshotai/Kimi-K2-Thinking</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
