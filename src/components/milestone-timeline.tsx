import { CheckCircle2, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JOURNEY_START, PHASES } from "@/lib/config";
import { MILESTONES, type Milestone } from "@/lib/milestones";

type MilestoneStatus = "hit" | "in-progress" | "upcoming";

function getCurrentJourneyMonth(now: Date = new Date()): number {
  const monthsIn = Math.floor(
    (now.getTime() - JOURNEY_START.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );
  return Math.max(1, Math.min(12, monthsIn + 1));
}

function statusFor(milestone: Milestone, currentMonth: number): MilestoneStatus {
  if (milestone.hit) return "hit";
  if (
    milestone.targetMonth === currentMonth ||
    milestone.targetMonth === currentMonth + 1
  ) {
    return "in-progress";
  }
  return "upcoming";
}

function StatusBadge({ status }: { status: MilestoneStatus }) {
  if (status === "hit") {
    return <Badge variant="default">Hit</Badge>;
  }
  if (status === "in-progress") {
    return <Badge variant="secondary">In progress</Badge>;
  }
  return <Badge variant="outline">Upcoming</Badge>;
}

export function MilestoneTimeline() {
  const currentMonth = getCurrentJourneyMonth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestone timeline</CardTitle>
        <CardDescription>
          21 milestones across 4 phases. The shape of year one.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {PHASES.map((phase, phaseIdx) => {
          const phaseMilestones = MILESTONES.filter(
            (m) => m.phase === phase.number
          );

          return (
            <div key={phase.number} className="flex flex-col gap-4">
              {phaseIdx > 0 ? <Separator /> : null}

              <div className="flex flex-col gap-1 pt-1">
                <h3 className="font-heading text-base font-medium text-foreground">
                  Phase {phase.number} &mdash; {phase.name}
                </h3>
                <p className="text-xs text-muted-foreground">{phase.theme}</p>
              </div>

              <ul className="flex flex-col gap-3">
                {phaseMilestones.map((milestone) => {
                  const status = statusFor(milestone, currentMonth);
                  const Icon = status === "hit" ? CheckCircle2 : Circle;
                  const iconClass =
                    status === "hit"
                      ? "text-green-600 dark:text-green-500"
                      : "text-muted-foreground/60";

                  return (
                    <li
                      key={milestone.id}
                      className="flex items-start gap-3"
                    >
                      <Icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`}
                        aria-hidden="true"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-sm text-foreground">
                            {milestone.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {milestone.hit && milestone.hitDate
                              ? `Hit: ${milestone.hitDate}`
                              : `Target: Month ${milestone.targetMonth}`}
                          </span>
                        </div>
                        <div className="shrink-0">
                          <StatusBadge status={status} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
