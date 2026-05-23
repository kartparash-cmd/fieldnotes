import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DailyLog, User } from "@/lib/supabase";

type RecentActivityProps = {
  logs: DailyLog[];
  users: User[];
};

function formatRow(log: DailyLog): string {
  if (log.activity_description && log.activity_description.trim().length > 0) {
    return log.activity_description;
  }
  const hours = log.hours_logged ?? 0;
  const concepts = log.concepts_added ?? 0;
  return `${hours}h logged, ${concepts} concept notes.`;
}

function formatDate(iso: string): string {
  try {
    // log_date is a date-only string; parse as UTC midnight to avoid drift.
    const d = new Date(iso + "T00:00:00Z");
    return format(d, "MMM d");
  } catch {
    return iso;
  }
}

export function RecentActivity({ logs, users }: RecentActivityProps) {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const rows = logs.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>The last 10 entries.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 py-2">
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No entries yet.
          </div>
        ) : (
          rows.map((log, i) => {
            const user = userMap.get(log.user_id);
            return (
              <div key={log.id} className="flex flex-col gap-1">
                <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="w-16 shrink-0 text-sm font-medium text-foreground">
                    {formatDate(log.log_date)}
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {user?.display_name ?? "—"}
                  </Badge>
                  <div className="flex-1 text-sm text-muted-foreground">
                    {formatRow(log)}
                  </div>
                </div>
                {i < rows.length - 1 ? <Separator /> : null}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
