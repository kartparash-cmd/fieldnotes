import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase, type CaseStudy, type CaseStudyStatus } from "@/lib/supabase";

type RouteParams = { slug: string };

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

async function fetchCaseStudy(slug: string): Promise<CaseStudy | null> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("detail_slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as CaseStudy;
}

async function readMdxFile(slug: string): Promise<string | null> {
  const filePath = path.join(
    process.cwd(),
    "src/content/case-studies",
    `${slug}.mdx`,
  );
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("detail_slug");

  if (error || !data) return [];
  return data
    .map((row) => row.detail_slug as string | null)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const study = await fetchCaseStudy(slug);
  if (!study) {
    return {
      title: "Case Study Not Found",
      description: "This case study could not be found.",
    };
  }
  return {
    title: study.title,
    description: study.one_line_summary,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const study = await fetchCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const mdxSource = await readMdxFile(slug);

  const dateLabel = study.published_date
    ? `Published ${study.published_date}`
    : study.target_completion_date
      ? `Target: ${study.target_completion_date}`
      : "Target: TBD";

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link
          href="/case-studies"
          className="text-muted-foreground hover:text-foreground"
        >
          ← All case studies
        </Link>
      </nav>

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Case Study #{study.id}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {study.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {statusBadge(study.status)}
          <span>{dateLabel}</span>
        </div>
        {study.tags && study.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {study.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      <Separator className="my-8" />

      <article className="prose prose-slate dark:prose-invert max-w-none">
        {mdxSource ? (
          <MDXRemote source={mdxSource} />
        ) : (
          <div className="rounded-lg border border-dashed border-foreground/15 bg-muted/40 p-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              Writeup not yet drafted
            </p>
            <p className="mt-2">
              The case study row exists in the database, but the MDX writeup
              hasn&apos;t been authored. Check back after the research and build
              phases complete.
            </p>
          </div>
        )}
      </article>
    </main>
  );
}
