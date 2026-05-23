import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { DailyLog, User } from "@/lib/supabase";

type ComparisonViewProps = {
  users: User[];
  logs: DailyLog[];
};

type UserStats = {
  totalHours: number;
  currentStreak: number;
  conceptsAdded: number;
  contentPublished: number;
};

function computeStats(userId: string, logs: DailyLog[]): UserStats {
  const userLogs = logs.filter((l) => l.user_id === userId);

  const totalHours = userLogs.reduce(
    (sum, l) => sum + (l.hours_logged ?? 0),
    0
  );
  const conceptsAdded = userLogs.reduce((sum, l) => sum + (l.concepts_added ?? 0), 0);
  const contentPublished = userLogs.reduce(
    (sum, l) => sum + (l.content_published ?? 0),
    0
  );

  // Streak: consecutive days ending today/yesterday where streak_held === true.
  const heldDates = new Set(
    userLogs.filter((l) => l.streak_held).map((l) => l.log_date)
  );
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const toIso = (d: Date) => {
    const yr = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dy = String(d.getUTCDate()).padStart(2, "0");
    return `${yr}-${mo}-${dy}`;
  };

  let cursor = new Date(todayUtc);
  let streak = 0;
  // Anchor: most recent held day must be today or yesterday.
  if (!heldDates.has(toIso(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!heldDates.has(toIso(cursor))) {
      return { totalHours, currentStreak: 0, conceptsAdded, contentPublished };
    }
  }
  while (heldDates.has(toIso(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return { totalHours, currentStreak: streak, conceptsAdded, contentPublished };
}

export function ComparisonView({ users, logs }: ComparisonViewProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Side by side
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Same metrics, both of us, honest. This is accountability, not competition.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {users.map((u) => {
          const s = computeStats(u.id, logs);
          return (
            <Card key={u.id}>
              <CardHeader>
                <CardTitle>{u.display_name}</CardTitle>
                {u.bio ? <CardDescription>{u.bio}</CardDescription> : null}
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 py-2">
                <Stat label="Total hours" value={s.totalHours} />
                <Stat label="Current streak" value={s.currentStreak} />
                <Stat label="Concepts added" value={s.conceptsAdded} />
                <Stat label="Content published" value={s.contentPublished} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
