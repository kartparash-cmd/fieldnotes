import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import type { DailyLog, User, CaseStudy } from "@/lib/supabase";
import { HeroStats } from "@/components/hero-stats";
import { PhaseProgress } from "@/components/phase-progress";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { ComparisonView } from "@/components/comparison-view";
import { RecentActivity } from "@/components/recent-activity";

export const revalidate = 60;

function toIsoDate(d: Date): string {
  const yr = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dy = String(d.getUTCDate()).padStart(2, "0");
  return `${yr}-${mo}-${dy}`;
}

/**
 * Streak: consecutive days ending today or yesterday where any user had
 * streak_held === true. logs come pre-sorted desc by log_date.
 *
 * Edge cases:
 *   - no logs at all → 0
 *   - most-recent held day isn't today or yesterday → 0 (streak broken)
 *   - multiple users on the same date → counted once
 *   - dates compared as UTC midnight to dodge local-timezone drift
 */
function currentStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;

  const heldDates = new Set(
    logs.filter((l) => l.streak_held).map((l) => l.log_date)
  );
  if (heldDates.size === 0) return 0;

  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  let cursor = new Date(todayUtc);
  // Anchor: most-recent held day must be today or yesterday.
  if (!heldDates.has(toIsoDate(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!heldDates.has(toIsoDate(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (heldDates.has(toIsoDate(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export default async function JourneyPage() {
  const [logsRes, usersRes, csRes] = await Promise.all([
    supabase
      .from("daily_logs")
      .select("*")
      .order("log_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("users").select("*").order("created_at", { ascending: true }),
    supabase.from("case_studies").select("*"),
  ]);

  const logs: DailyLog[] = !logsRes.error && logsRes.data ? (logsRes.data as DailyLog[]) : [];
  const users: User[] = !usersRes.error && usersRes.data ? (usersRes.data as User[]) : [];
  const caseStudies: CaseStudy[] = !csRes.error && csRes.data ? (csRes.data as CaseStudy[]) : [];

  const totalHours = logs.reduce((sum, l) => sum + (l.hours_logged ?? 0), 0);
  const contentPostsPublished = logs.reduce(
    (sum, l) => sum + (l.content_published ?? 0),
    0
  );
  const caseStudiesPublished = caseStudies.filter((c) => c.status === "published").length;
  const streak = currentStreak(logs);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <section className="flex flex-col gap-3 pt-12 pb-8 sm:pt-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          The Journey
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Public scoreboard. Updated daily. Honest, not gamified.
        </p>
      </section>

      <Separator />

      <section className="py-8">
        <HeroStats
          totalHours={totalHours}
          currentStreak={streak}
          caseStudiesPublished={caseStudiesPublished}
          contentPostsPublished={contentPostsPublished}
        />
      </section>

      <section className="py-8">
        <PhaseProgress />
      </section>

      <section className="py-8">
        <ActivityHeatmap logs={logs} />
      </section>

      <section className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>Milestone timeline</CardTitle>
            <CardDescription>
              Milestone timeline lands in Weekend 2.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-2 text-sm text-muted-foreground">
            21 milestones across 4 phases. Coming soon.
          </CardContent>
        </Card>
      </section>

      <section className="py-8">
        <ComparisonView users={users} logs={logs} />
      </section>

      <section className="py-8">
        <RecentActivity logs={logs} users={users} />
      </section>
    </div>
  );
}
