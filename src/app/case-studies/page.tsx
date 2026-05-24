import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, type CaseStudy, type CaseStudyStatus } from "@/lib/supabase";

export const metadata = {
  title: "Case Studies",
  description:
    "Six case studies grounded in real products. The seventh is this site itself.",
};

function statusBadge(status: CaseStudyStatus) {
  switch (status) {
    case "planned":
      return <Badge variant="secondary">planned</Badge>;
    case "research":
      return <Badge variant="outline">research</Badge>;
    case "building":
      return <Badge variant="default">building</Badge>;
    case "writing":
      return <Badge variant="default">writing</Badge>;
    case "published":
      return (
        <Badge
          variant="default"
          className="bg-emerald-600 text-white hover:bg-emerald-600/90"
        >
          published
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function formatDateLabel(study: CaseStudy): string {
  if (study.published_date) return `Published ${study.published_date}`;
  if (study.target_completion_date)
    return `Target: ${study.target_completion_date}`;
  return "Target: TBD";
}

export default async function CaseStudiesPage() {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("id", { ascending: true });

  const studies: CaseStudy[] = error || !data ? [] : (data as CaseStudy[]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Case Studies
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Six case studies grounded in real products I&apos;ve built. The seventh is
          this site itself. Each demonstrates a specific production AI engineering
          pattern with eval data, cost analysis, and honest failure-mode notes.
        </p>
      </header>

      {studies.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Case studies are still loading. Check back shortly.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <Link
              key={study.id}
              href={`/case-studies/${study.detail_slug}`}
              className="group block transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Case Study #{study.id}
                    </span>
                    {statusBadge(study.status)}
                  </div>
                  <CardTitle className="mt-2 text-lg">
                    <h3>{study.title}</h3>
                  </CardTitle>
                  <CardDescription>{study.one_line_summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {study.tags && study.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {study.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {formatDateLabel(study)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
