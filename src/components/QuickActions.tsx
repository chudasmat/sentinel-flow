import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function QuickActions({ searchQuery, onSearchChange }: Props) {
  return (
    <div className="border-b border-border px-4 py-2 flex items-center gap-2">
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search thread ID or message…"
          className="h-7 pl-7 text-xs font-mono bg-secondary border-border w-[17.3rem]"
        />
      </div>
    </div>
  );
}
