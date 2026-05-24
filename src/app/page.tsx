import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import type { DailyLog } from "@/lib/supabase";
import {
  SITE_CONFIG,
  getCurrentPhase,
  CURRENT_WEEK_TARGET,
} from "@/lib/config";

export const revalidate = 60;

const SECTION_LINKS = [
  { href: "/case-studies", label: "Case Studies", blurb: "The portfolio." },
  { href: "/journey", label: "Journey", blurb: "Metrics dashboard." },
  { href: "/notes", label: "Notes", blurb: "Published writeups." },
  { href: "/about", label: "About", blurb: "The why." },
];

function formatLogDate(d: string): string {
  try {
    return new Date(d + "T00:00:00Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return d;
  }
}

export default async function Home() {
  const currentPhase = getCurrentPhase();

  // Latest 3 daily logs — must not crash if table is empty or query fails.
  let latestLogs: DailyLog[] = [];
  const logsRes = await supabase
    .from("daily_logs")
    .select("*")
    .order("log_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);
  if (!logsRes.error && logsRes.data) {
    latestLogs = logsRes.data as DailyLog[];
  }

  // Total hours logged.
  const hoursRes = await supabase
    .from("daily_logs")
    .select("hours_logged");
  let totalHours = 0;
  if (!hoursRes.error && hoursRes.data) {
    totalHours = hoursRes.data.reduce(
      (sum: number, row: { hours_logged: number | null }) =>
        sum + (row.hours_logged ?? 0),
      0
    );
  }

  // Total case studies published.
  const csRes = await supabase
    .from("case_studies")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");
  const totalPublishedCaseStudies = csRes.error ? 0 : csRes.count ?? 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Field Notes
        </div>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {SITE_CONFIG.tagline}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {SITE_CONFIG.description}
        </p>

        {/* Phase indicator row */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Badge variant="outline" className="h-7 px-3 text-xs sm:text-sm">
            Phase {currentPhase.number} of 4 — {currentPhase.name}
          </Badge>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">This week:</span>{" "}
            {CURRENT_WEEK_TARGET}
          </p>
        </div>
      </section>

      <Separator />

      {latestLogs.length > 0 ? (
        <>
          {/* Latest */}
          <section className="py-12">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Latest
              </h2>
              <Link
                href="/journey"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {latestLogs.map((log) => (
                <Card key={log.id} size="sm">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                      {formatLogDate(log.log_date)}
                    </CardTitle>
                    <CardDescription className="text-foreground">
                      {log.activity_description ?? "Logged activity"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {log.hours_logged ?? 0} hrs
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Stats */}
          <section className="py-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardDescription>Total hours logged</CardDescription>
                  <CardTitle className="font-heading text-4xl font-semibold tracking-tight">
                    {totalHours}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Case studies published</CardDescription>
                  <CardTitle className="font-heading text-4xl font-semibold tracking-tight">
                    {totalPublishedCaseStudies}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </section>
        </>
      ) : (
        /* Week 1 commitment panel — shown until daily logs accumulate */
        <section className="py-12">
          <Card>
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-wide">
                This week&apos;s commitment
              </CardDescription>
              <CardTitle className="font-heading text-xl font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl">
                {CURRENT_WEEK_TARGET}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href="/journey"
                className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                See the full 12-month timeline →
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      <Separator />

      {/* Section links */}
      <section className="py-12">
        <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight">
          Explore
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SECTION_LINKS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <div className="font-medium text-foreground group-hover:text-foreground">
                {s.label}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.blurb}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
