import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function seed() {
  console.log("Seeding users...");
  const { data: users, error: usersError } = await supabase
    .from("users")
    .upsert(
      [
        {
          username: "kay",
          display_name: "Kartikeya Parashar",
          bio: "Builder going deeper. Founder of 6 AI products. Going from generalist to specialist in AI engineering.",
        },
        {
          username: "bharat",
          display_name: "Bharat",
          bio: "Co-traveler on the 12-month journey.",
        },
      ],
      { onConflict: "username" }
    )
    .select();

  if (usersError) {
    console.error("Users seed failed:", usersError);
    process.exit(1);
  }
  console.log(`  Seeded ${users?.length ?? 0} users.`);

  console.log("Seeding case studies...");
  const caseStudies = [
    {
      id: 1,
      title: "Enterprise RAG",
      one_line_summary:
        "Hybrid retrieval (BM25 + embeddings + reranker) on a real document corpus, with retrieval and generation evals scored independently.",
      status: "planned",
      tags: ["rag", "evals", "retrieval"],
      target_completion_date: "2026-08-15",
      detail_slug: "enterprise-rag",
    },
    {
      id: 2,
      title: "Production Agent",
      one_line_summary:
        "A tool-using agent with state, retries, and HITL fallback, built on raw Anthropic API before reaching for LangGraph.",
      status: "planned",
      tags: ["agents", "tool-use", "observability"],
      target_completion_date: "2026-10-15",
      detail_slug: "production-agent",
    },
    {
      id: 3,
      title: "Classification & Extraction",
      one_line_summary:
        "A-F evidence grading with structured outputs, confidence scoring, and Haiku vs Sonnet vs Opus cost modeling.",
      status: "planned",
      tags: ["classification", "structured-output", "cost"],
      target_completion_date: "2026-11-15",
      detail_slug: "classification-extraction",
    },
    {
      id: 4,
      title: "Multi-Modal Processing",
      one_line_summary:
        "Vision pipeline for PDFs, tables, and charts, with a multi-modal eval framework and latency/cost trade-offs.",
      status: "planned",
      tags: ["vision", "multimodal", "evals"],
      target_completion_date: "2026-12-15",
      detail_slug: "multi-modal",
    },
    {
      id: 5,
      title: "Developer-Facing AI Feature",
      one_line_summary:
        "Streaming UX with latency budgets, prompt versioning, caching, and online evals on real user traffic.",
      status: "planned",
      tags: ["developer-experience", "streaming", "caching"],
      target_completion_date: "2027-01-31",
      detail_slug: "developer-facing-feature",
    },
    {
      id: 6,
      title: "Red-Teaming & Safety",
      one_line_summary:
        "50-prompt adversarial dataset, defensive guardrails, and a failure-mode taxonomy with detection-rate metrics.",
      status: "planned",
      tags: ["safety", "red-team", "evals"],
      target_completion_date: "2027-02-28",
      detail_slug: "red-teaming",
    },
    {
      id: 7,
      title: "The Tracker Build",
      one_line_summary:
        "Field Notes itself — $0-budget product engineering, schema-first design, and 12 months of dogfooding observations.",
      status: "planned",
      tags: ["meta", "production-eng", "observability"],
      target_completion_date: "2027-04-30",
      detail_slug: "tracker-build",
    },
  ];

  const { data: cs, error: csError } = await supabase
    .from("case_studies")
    .upsert(caseStudies, { onConflict: "id" })
    .select();

  if (csError) {
    console.error("Case studies seed failed:", csError);
    process.exit(1);
  }
  console.log(`  Seeded ${cs?.length ?? 0} case studies.`);

  console.log("Done.");
}

seed();
