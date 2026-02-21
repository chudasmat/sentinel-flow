import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLASSIFICATION_LABELS } from "@/lib/types";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  labelFilter: string;
  onLabelFilterChange: (label: string) => void;
}

export function QuickActions({ searchQuery, onSearchChange, labelFilter, onLabelFilterChange }: Props) {
  return (
    <div className="border-b border-border px-4 py-2 flex items-center gap-2">
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search thread ID or message…"
          className="h-7 pl-7 text-xs font-mono bg-secondary border-border w-64"
        />
      </div>
      <Select value={labelFilter} onValueChange={onLabelFilterChange}>
        <SelectTrigger className="h-7 w-44 text-xs font-mono bg-secondary border-border">
          <SelectValue placeholder="All labels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs font-mono">All labels</SelectItem>
          {CLASSIFICATION_LABELS.map((label) => (
            <SelectItem key={label} value={label} className="text-xs font-mono">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="ml-auto">
        <button
          className="border-l-2 border-safe text-safe text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-safe/10 tracking-wider"
          onClick={() => alert("Execution limits (mock)")}
        >
          EXECUTION LIMITS
        </button>
      </div>
    </div>
  );
}
