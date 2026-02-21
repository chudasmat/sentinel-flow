import { useState } from "react";

export function QuickActions() {
  const [sensitivity, setSensitivity] = useState(50);

  return (
    <div className="border-b border-border px-4 py-3 flex gap-6">
      {/* Left column: action buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-muted-foreground tracking-widest">QUICK_ACTIONS</span>
        <button
          className="border-l-2 border-danger text-danger text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-danger/10 text-left tracking-wider"
          onClick={() => alert("Session killed (mock)")}
        >
          KILL SESSION
        </button>
        <button
          className="border-l-2 border-hazard text-hazard text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-hazard/10 text-left tracking-wider"
          onClick={() => alert("State rolled back (mock)")}
        >
          ROLLBACK STATE
        </button>
        <button
          className="border-l-2 border-safe text-safe text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-safe/10 text-left tracking-wider"
          onClick={() => alert("Execution limits (mock)")}
        >
          EXECUTION LIMITS
        </button>
      </div>

      {/* Sensitivity control */}
      <div className="flex flex-col gap-2 ml-auto">
        <span className="text-[10px] text-muted-foreground tracking-widest">SENSITIVITY</span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-32 accent-safe"
          />
          <span className="text-xs text-foreground font-mono w-10 text-right">{sensitivity}%</span>
        </div>
      </div>
    </div>
  );
}
