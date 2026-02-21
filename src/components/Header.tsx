import { useEffect, useState } from "react";
import { getSystemLatency } from "@/lib/mock-data";

export function Header() {
  const [latency, setLatency] = useState(getSystemLatency());
  const [mode] = useState<"ACTIVE" | "PASSIVE">("ACTIVE");

  useEffect(() => {
    const interval = setInterval(() => setLatency(getSystemLatency()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <h1 className="text-sm font-bold tracking-widest text-safe">
        AGENT_FIREWALL_v1.0
      </h1>
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span>
          System Latency:{" "}
          <span className="text-foreground">{latency}ms</span>
        </span>
        <span>
          Mode:{" "}
          <span className={mode === "ACTIVE" ? "text-safe" : "text-hazard"}>
            {mode}
          </span>
        </span>
      </div>
    </header>
  );
}
