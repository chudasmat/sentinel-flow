import { useMemo, useState } from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import type { ThreadSummary } from "@/lib/types";
import { getRiskColorClass, getRiskGlowClass } from "@/lib/types";

type SortKey = "risk_score" | "created_at" | "thread_id" | "classification_label";
type SortDir = "asc" | "desc";

interface Props {
  threads: ThreadSummary[];
  onSelectThread: (threadId: string) => void;
}

export function ThreadTable({ threads, onSelectThread }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("risk_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...threads].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "risk_score") cmp = a.risk_score - b.risk_score;
      else if (sortKey === "created_at") cmp = a.created_at.localeCompare(b.created_at);
      else if (sortKey === "thread_id") cmp = a.thread_id.localeCompare(b.thread_id);
      else cmp = a.classification_label.localeCompare(b.classification_label);
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [threads, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b">
          <TableHead className="cursor-pointer text-xs select-none" onClick={() => toggleSort("thread_id")}>
            THREAD_ID{sortIndicator("thread_id")}
          </TableHead>
          <TableHead className="text-xs">FIRST_MESSAGE</TableHead>
          <TableHead className="cursor-pointer text-xs select-none w-24 text-center" onClick={() => toggleSort("risk_score")}>
            RISK{sortIndicator("risk_score")}
          </TableHead>
          <TableHead className="cursor-pointer text-xs select-none" onClick={() => toggleSort("classification_label")}>
            LABEL{sortIndicator("classification_label")}
          </TableHead>
          <TableHead className="text-xs text-center">MSGS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((t) => (
          <TableRow
            key={t.thread_id}
            className="cursor-pointer scanline-hover border-b border-border"
            onClick={() => onSelectThread(t.thread_id)}
          >
            <TableCell className="text-xs text-muted-foreground font-mono py-2">
              {t.thread_id.substring(0, 12)}…
            </TableCell>
            <TableCell className="text-xs max-w-xs truncate py-2">
              {t.first_message_preview}
            </TableCell>
            <TableCell className="text-center py-2">
              <span className={`text-sm font-bold ${getRiskColorClass(t.risk_score)} ${getRiskGlowClass(t.risk_score)}`}>
                {t.risk_score.toFixed(1)}
              </span>
            </TableCell>
            <TableCell className="py-2">
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger>
                  <span className="inline-flex">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono cursor-default ${
                        t.classification_label === "safe"
                          ? "border-safe text-safe"
                          : t.risk_score > 6
                          ? "border-danger text-danger"
                          : "border-hazard text-hazard"
                      }`}
                    >
                      {t.classification_label}
                    </Badge>
                  </span>
                </HoverCardTrigger>
                <HoverCardContent side="top" align="start" className="w-auto p-2 bg-popover border-border">
                  <div className="space-y-1">
                    {(t.top_probabilities ?? []).map((p) => (
                      <div key={p.label} className="flex items-center justify-between gap-4 text-[10px] font-mono">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="text-foreground">{(p.probability * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </TableCell>
            <TableCell className="text-xs text-center text-muted-foreground py-2">
              {t.message_count}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
