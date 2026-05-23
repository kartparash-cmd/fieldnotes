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
          bio: "Builder going deeper. Founder of 21 AI products at Kaydenlabs. Going from generalist to specialist in AI engineering. Flagships: WealthPilot, Hermes, LastingPath.",
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
      title: "Autonomous Trading with Safety-First Architecture",
      one_line_summary:
        "WealthPilot's 10-layer risk control architecture, regime-aware kill-switch, and weekly walk-forward retrain — the patterns a hedge fund customer needs to actually deploy LLM-driven trading agents.",
      status: "planned",
      tags: ["safety", "agents", "trading", "evals"],
      target_completion_date: "2026-08-15",
      detail_slug: "wealthpilot-safety",
    },
    {
      id: 2,
      title: "Multi-Agent System with Role Separation",
      one_line_summary:
        "Hermes Agent System — permission-layer separation of duties across Midas, Oracle, Plutus, and Kuber. How to give an enterprise multiple autonomous AI operators without them stepping on each other.",
      status: "planned",
      tags: ["agents", "multi-agent", "observability"],
      target_completion_date: "2026-10-15",
      detail_slug: "hermes-multi-agent",
    },
    {
      id: 3,
      title: "Production Vertical AI in a Regulated Domain",
      one_line_summary:
        "LastingPath + Sage (Claude reasoning layer) — structured workflow routing, OCR-driven form auto-population, audit logging. What it takes to ship consumer AI in estate, tax, or healthcare.",
      status: "planned",
      tags: ["vertical-ai", "structured-output", "compliance"],
      target_completion_date: "2026-11-15",
      detail_slug: "lastingpath-vertical-ai",
    },
    {
      id: 4,
      title: "Domain-Specific Document Understanding at Scale",
      one_line_summary:
        "TaxEXP — K1 and Form 1065 generation pipeline with extraction validation, confidence scoring, and human-in-the-loop fallback. Cost-modeled across Haiku/Sonnet/Opus.",
      status: "planned",
      tags: ["document-understanding", "structured-output", "cost"],
      target_completion_date: "2026-12-15",
      detail_slug: "taxexp-document-understanding",
    },
    {
      id: 5,
      title: "Custom Claude Skill + Agentic Workflow",
      one_line_summary:
        "Reel Generator — packaging a domain-specific creative workflow as a Claude Skill, with quality gates and brand-voice evals in the agentic pipeline.",
      status: "planned",
      tags: ["claude-skills", "agents", "evals"],
      target_completion_date: "2027-01-31",
      detail_slug: "reel-generator-claude-skill",
    },
    {
      id: 6,
      title: "Eval-Driven Hardening of an LLM Product",
      one_line_summary:
        "50-prompt adversarial dataset, regression eval suite, and a failure-mode taxonomy with detection-rate metrics — applied to Sage in LastingPath.",
      status: "planned",
      tags: ["evals", "safety", "red-team"],
      target_completion_date: "2027-02-28",
      detail_slug: "evals-and-hardening",
    },
    {
      id: 7,
      title: "The Tapasya Tracker (Field Notes Itself)",
      one_line_summary:
        "$0-budget product engineering, schema-first design, and 12 months of dogfooding observations from running my own deliberate-practice tracker.",
      status: "planned",
      tags: ["meta", "production-eng", "observability"],
      target_completion_date: "2027-04-30",
      detail_slug: "tapasya-tracker",
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
