import { useEffect, useRef } from "react";
import type { TaintLogEntry } from "@/lib/types";
import { getRiskColorClass } from "@/lib/types";

interface Props {
  entries: TaintLogEntry[];
}

export function TaintLog({ entries }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3,
    } as Intl.DateTimeFormatOptions);
  }

  return (
    <div className="border-t border-border">
      <div className="px-3 py-1.5 text-[10px] text-muted-foreground tracking-wider border-b border-border">
        TAINT_TRACKER_LOG
      </div>
      <div
        ref={containerRef}
        className="h-40 overflow-y-auto p-2 space-y-0.5 bg-background"
      >
        {entries.length === 0 && (
          <div className="text-[10px] text-muted-foreground">&gt; No taint events detected.</div>
        )}
        {entries.map((entry, i) => (
          <div
            key={`${entry.message_id}-${i}`}
            className="text-[11px] font-mono leading-tight log-entry-flash flex gap-2"
          >
            <span className="text-muted-foreground shrink-0">
              [{formatTime(entry.timestamp)}]
            </span>
            <span className={getRiskColorClass(entry.score)}>
              [{entry.score.toFixed(1)}]
            </span>
            <span className="text-foreground/80">
              {entry.event}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
