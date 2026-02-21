export function Header() {
  return (
    <header className="flex items-center border-b border-border px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-safe" />
        <h1 className="text-sm font-bold tracking-widest text-foreground">
          AGENT_FIREWALL_v1.0
        </h1>
      </div>
    </header>
  );
}
