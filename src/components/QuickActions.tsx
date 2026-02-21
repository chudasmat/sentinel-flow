import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function QuickActions({ searchQuery, onSearchChange }: Props) {
  return (
    <div className="border-b border-border px-4 py-2 flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground tracking-widest mr-2">QUICK_ACTIONS</span>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search thread ID or message…"
          className="h-7 pl-7 text-xs font-mono bg-secondary border-border"
        />
      </div>
      <button
        className="border-l-2 border-safe text-safe text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-safe/10 tracking-wider"
        onClick={() => alert("Execution limits (mock)")}
      >
        EXECUTION LIMITS
      </button>
    </div>
  );
}
