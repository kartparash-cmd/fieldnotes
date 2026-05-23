"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DailyLog } from "@/lib/supabase";

type ActivityHeatmapProps = {
  logs: DailyLog[];
};

type CalendarDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function levelFromHours(hours: number): 0 | 1 | 2 | 3 | 4 {
  if (hours <= 0) return 0;
  if (hours < 2) return 1;
  if (hours < 4) return 2;
  if (hours < 6) return 3;
  return 4;
}

function toIsoDate(d: Date): string {
  // YYYY-MM-DD in UTC to keep timezone consistent with DB date-only values.
  const yr = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dy = String(d.getUTCDate()).padStart(2, "0");
  return `${yr}-${mo}-${dy}`;
}

function buildDays(logs: DailyLog[]): CalendarDay[] {
  // Accumulate hours per date — multiple users can log on the same date.
  const totals = new Map<string, number>();
  for (const log of logs) {
    const date = log.log_date;
    const hours = log.hours_logged ?? 0;
    totals.set(date, (totals.get(date) ?? 0) + hours);
  }

  // Build a contiguous range of the last 84 days (12 weeks) ending today (UTC).
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const days: CalendarDay[] = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(todayUtc);
    d.setUTCDate(todayUtc.getUTCDate() - i);
    const iso = toIsoDate(d);
    const hours = totals.get(iso) ?? 0;
    days.push({ date: iso, count: hours, level: levelFromHours(hours) });
  }
  return days;
}

export function ActivityHeatmap({ logs }: ActivityHeatmapProps) {
  const data = buildDays(logs);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Last 12 weeks. Hours logged per day.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto py-2">
        <ActivityCalendar
          data={data}
          blockSize={14}
          blockMargin={4}
          fontSize={12}
          showTotalCount={false}
          labels={{
            totalCount: "{{count}} hours in the last 12 weeks",
          }}
        />
      </CardContent>
    </Card>
  );
}
