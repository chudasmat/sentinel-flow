import { useEffect, useState } from "react";
import { getSystemLatency } from "@/lib/mock-data";

export function Header() {
  const [latency, setLatency] = useState(getSystemLatency());
  const [mode] = useState<"STRICT" | "PASSIVE">("STRICT");

  useEffect(() => {
    const interval = setInterval(() => setLatency(getSystemLatency()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-safe" />
        <h1 className="text-sm font-bold tracking-widest text-foreground">
          AGENT_FIREWALL_v1.0
        </h1>
      </div>
      <div className="flex items-center gap-6 text-xs">
        <span className="text-muted-foreground">
          System Latency: <span className="text-safe">{latency}ms</span>
        </span>
        <span className="border border-border px-2 py-0.5 text-muted-foreground">
          Mode: <span className={mode === "STRICT" ? "text-safe" : "text-hazard"}>{mode}</span>
        </span>
      </div>
    </header>
  );
}
