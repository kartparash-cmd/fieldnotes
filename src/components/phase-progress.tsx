import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentPhase, getCurrentPhaseProgress } from "@/lib/config";

export function PhaseProgress() {
  const phase = getCurrentPhase();
  const pct = getCurrentPhaseProgress();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Badge variant="outline" className="h-7 px-3 text-xs sm:text-sm">
            Phase {phase.number} of 4 — {phase.name}
          </Badge>
          <p className="text-sm text-muted-foreground">{phase.theme}</p>
        </div>

        <div className="h-2 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded bg-slate-900 dark:bg-slate-50"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          {pct}% through Phase {phase.number}
        </div>
      </CardContent>
    </Card>
  );
}
