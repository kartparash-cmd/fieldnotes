import { Clock, Flame, FileText, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type HeroStatsProps = {
  totalHours: number;
  currentStreak: number;
  caseStudiesPublished: number;
  contentPostsPublished: number;
};

type StatCard = {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
};

export function HeroStats({
  totalHours,
  currentStreak,
  caseStudiesPublished,
  contentPostsPublished,
}: HeroStatsProps) {
  const cards: StatCard[] = [
    { label: "Total hours logged", value: totalHours, icon: Clock },
    { label: "Current streak (days)", value: currentStreak, icon: Flame },
    { label: "Case studies published", value: caseStudiesPublished, icon: FileText },
    { label: "Content posts published", value: contentPostsPublished, icon: Send },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label}>
            <CardContent className="relative flex flex-col gap-1 py-2">
              <Icon className="absolute right-4 top-2 h-4 w-4 text-muted-foreground" />
              <div className="font-heading text-3xl font-bold tracking-tight text-foreground">
                {c.value}
              </div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
