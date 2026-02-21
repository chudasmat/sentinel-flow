import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function QuickActions() {
  const [sensitivity, setSensitivity] = useState([50]);

  return (
    <div className="flex items-center gap-3 border-b px-4 py-2">
      <Button
        variant="outline"
        size="sm"
        className="border-danger text-danger text-xs font-mono hover:bg-danger hover:text-primary-foreground"
        onClick={() => alert("Session killed (mock)")}
      >
        &gt; KILL_SESSION
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-hazard text-hazard text-xs font-mono hover:bg-hazard hover:text-primary-foreground"
        onClick={() => alert("State rolled back (mock)")}
      >
        &gt; ROLLBACK_STATE
      </Button>
      <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
        <span>&gt; SENSITIVITY:</span>
        <Slider
          value={sensitivity}
          onValueChange={setSensitivity}
          max={100}
          step={1}
          className="w-32"
        />
        <span className="text-foreground w-8 text-right">{sensitivity[0]}%</span>
      </div>
    </div>
  );
}
