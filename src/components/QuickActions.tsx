export function QuickActions() {
  return (
    <div className="border-b border-border px-4 py-2 flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground tracking-widest mr-2">QUICK_ACTIONS</span>
      <button
        className="border-l-2 border-danger text-danger text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-danger/10 tracking-wider"
        onClick={() => alert("Session killed (mock)")}
      >
        KILL SESSION
      </button>
      <button
        className="border-l-2 border-hazard text-hazard text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-hazard/10 tracking-wider"
        onClick={() => alert("State rolled back (mock)")}
      >
        ROLLBACK STATE
      </button>
      <button
        className="border-l-2 border-safe text-safe text-xs font-mono px-3 py-1.5 bg-transparent hover:bg-safe/10 tracking-wider"
        onClick={() => alert("Execution limits (mock)")}
      >
        EXECUTION LIMITS
      </button>
    </div>
  );
}
