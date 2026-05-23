import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Notes — Field Notes",
  description:
    "Curated, polished writeups. Different from Obsidian — Obsidian is the thinking, this is the publishing.",
};

type NoteFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readTime: number;
};

type NoteListEntry = NoteFrontmatter & {
  slug: string;
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

async function loadNotes(): Promise<NoteListEntry[]> {
  const dir = path.join(process.cwd(), "src/content/notes");
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const entries: NoteListEntry[] = [];

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, "");
    try {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const fm = toFrontmatter(data, body);
      if (!fm.title || !fm.date) continue;
      entries.push({ slug, ...fm });
    } catch {
      // skip unreadable files
    }
  }

  return entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
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

export default async function NotesPage() {
  const notes = await loadNotes();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8 space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Notes
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Curated, polished writeups. Different from Obsidian — Obsidian is the
          thinking, this is the publishing.
        </p>
      </header>

      <Separator className="mb-8" />

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">First notes land soon.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {notes.map((note, idx) => (
            <li key={note.slug} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {note.title}
                  </Link>
                </h2>
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.date)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {note.summary}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
                <Badge variant="secondary" className="text-[10px]">
                  {note.readTime} min read
                </Badge>
              </div>
              {idx < notes.length - 1 ? <Separator className="mt-4" /> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
