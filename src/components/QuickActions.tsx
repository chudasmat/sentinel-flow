import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CLASSIFICATION_LABELS, type ClassificationLabel } from "@/lib/types";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  labelFilters: ClassificationLabel[];
  onLabelFiltersChange: (labels: ClassificationLabel[]) => void;
}

export function QuickActions({ searchQuery, onSearchChange, labelFilters, onLabelFiltersChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleLabel(label: ClassificationLabel) {
    if (labelFilters.includes(label)) {
      onLabelFiltersChange(labelFilters.filter((l) => l !== label));
    } else {
      onLabelFiltersChange([...labelFilters, label]);
    }
  }

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
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="h-7 px-3 text-xs font-mono bg-secondary border border-border flex items-center gap-1.5"
        >
          {labelFilters.length === 0 ? "All labels" : `${labelFilters.length} label${labelFilters.length > 1 ? "s" : ""}`}
          {labelFilters.length > 0 && (
            <X
              className="w-3 h-3 text-muted-foreground hover:text-foreground"
              onClick={(e) => { e.stopPropagation(); onLabelFiltersChange([]); }}
            />
          )}
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border shadow-lg w-52 max-h-64 overflow-y-auto">
            {CLASSIFICATION_LABELS.map((label) => (
              <label
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono hover:bg-secondary cursor-pointer"
              >
                <Checkbox
                  checked={labelFilters.includes(label)}
                  onCheckedChange={() => toggleLabel(label)}
                  className="h-3.5 w-3.5"
                />
                {label}
              </label>
            ))}
          </div>
        )}
      </div>
      {labelFilters.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {labelFilters.map((l) => (
            <Badge
              key={l}
              variant="outline"
              className="text-[9px] font-mono cursor-pointer border-muted-foreground/50"
              onClick={() => toggleLabel(l)}
            >
              {l} <X className="w-2.5 h-2.5 ml-0.5" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
