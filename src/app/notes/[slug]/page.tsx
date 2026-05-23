import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type RouteParams = { slug: string };

type NoteFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readTime: number;
};

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }
  const block = match[1];
  const body = match[2] ?? "";
  const data: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();
    data[key] = value;
  }
  return { data, body };
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  const inside = value.replace(/^\[/, "").replace(/\]$/, "");
  return inside
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function computeReadTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function toFrontmatter(
  data: Record<string, string>,
  body: string,
): NoteFrontmatter {
  const stripQuotes = (s: string | undefined) =>
    (s ?? "").replace(/^["']|["']$/g, "");
  const readTimeRaw = data.readTime ? Number(data.readTime) : NaN;
  return {
    title: stripQuotes(data.title),
    date: stripQuotes(data.date),
    summary: stripQuotes(data.summary),
    tags: parseTags(data.tags),
    readTime: Number.isFinite(readTimeRaw) ? readTimeRaw : computeReadTime(body),
  };
}

async function readNote(
  slug: string,
): Promise<{ frontmatter: NoteFrontmatter; body: string } | null> {
  const filePath = path.join(
    process.cwd(),
    "src/content/notes",
    `${slug}.mdx`,
  );
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const fm = toFrontmatter(data, body);
    if (!fm.title || !fm.date) return null;
    return { frontmatter: fm, body };
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return format(d, "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const note = await readNote(slug);
  if (!note) {
    return {
      title: "Note Not Found — Field Notes",
      description: "This note could not be found.",
    };
  }
  return {
    title: `${note.frontmatter.title} — Field Notes`,
    description: note.frontmatter.summary,
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const note = await readNote(slug);

  if (!note) {
    notFound();
  }

  const { frontmatter, body } = note;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm">
        <Link
          href="/notes"
          className="text-muted-foreground hover:text-foreground"
        >
          ← All notes
        </Link>
      </nav>

      <header className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(frontmatter.date)}</span>
          <span aria-hidden="true">·</span>
          <span>{frontmatter.readTime} min read</span>
          {frontmatter.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <Separator className="my-8" />

      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-heading prose-h2:mt-10 prose-h2:text-xl prose-p:leading-relaxed">
        <MDXRemote source={body} />
      </article>
    </main>
  );
}
