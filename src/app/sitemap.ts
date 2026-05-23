import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { supabase, type CaseStudy } from "@/lib/supabase";

const SITE_URL = "https://fieldnotes.kaydenlabs.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/journey`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Case study detail pages from Supabase
  let caseStudyEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from("case_studies")
      .select("detail_slug, published_date")
      .order("id", { ascending: true });
    if (data) {
      caseStudyEntries = (data as Pick<CaseStudy, "detail_slug" | "published_date">[]).map(
        (study) => ({
          url: `${SITE_URL}/case-studies/${study.detail_slug}`,
          lastModified: study.published_date ? new Date(study.published_date) : now,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }),
      );
    }
  } catch {
    // If Supabase is unreachable at build, fall through with the static entries.
  }

  // Notes from MDX filenames
  let noteEntries: MetadataRoute.Sitemap = [];
  try {
    const notesDir = path.join(process.cwd(), "src", "content", "notes");
    if (fs.existsSync(notesDir)) {
      const files = fs.readdirSync(notesDir).filter((f) => f.endsWith(".mdx"));
      noteEntries = files.map((file) => {
        const slug = file.replace(/\.mdx$/, "");
        const stat = fs.statSync(path.join(notesDir, file));
        return {
          url: `${SITE_URL}/notes/${slug}`,
          lastModified: stat.mtime,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        };
      });
    }
  } catch {
    // No notes directory yet — Agent E will create it.
  }

  return [...staticEntries, ...caseStudyEntries, ...noteEntries];
}
