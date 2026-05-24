import Link from "next/link";
import { Mail, Code, Briefcase, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "About",
  description:
    "Kartikeya Parashar. Builder going deeper. Founder of 21 AI products at Kaydenlabs. Going from generalist to specialist in AI engineering.",
};

const LEARNING_BULLETS = [
  "Evals discipline (currently building a 50-prompt eval suite for one of my products)",
  "Production RAG patterns (hybrid retrieval + reranking + retrieval/generation eval separation)",
  "Anthropic engineering practices (cookbook, Building Effective Agents, Contextual Retrieval)",
  "LLM internals (Karpathy, Jay Alammar, Toy Models of Superposition)",
  "Classical system design at intuition level (~6 canonical patterns)",
];

const FLAGSHIPS = [
  {
    title: "WealthPilot",
    href: "https://kaydenlabs.com/work/wealthpilot",
    blurb:
      "Autonomous self-improving trading system with a 10-layer risk control architecture, regime-aware kill-switch, and weekly walk-forward retrain.",
  },
  {
    title: "Hermes Agent System",
    href: "https://kaydenlabs.com/work/hermes-agent-system",
    blurb:
      "Multi-agent operating system enforcing separation of duties at the permission layer. Four agent personas (Midas, Oracle, Plutus, Kuber), each scoped to a single domain.",
  },
  {
    title: "LastingPath",
    href: "https://kaydenlabs.com/work/lastingpath",
    blurb:
      "Live estate administration platform with structured tool-calling, Sage (Claude reasoning layer), OCR-driven form population, and trust-by-design UX.",
  },
];

export default function AboutPage() {
  const email = SITE_CONFIG.author.email || "kart.parash@gmail.com";
  const github = SITE_CONFIG.author.github;
  const linkedin = SITE_CONFIG.author.linkedin;
  const kaydenlabs = SITE_CONFIG.author.kaydenlabs;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* Section 1: Hero */}
      <section className="flex flex-col items-start gap-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-200 text-3xl font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          KP
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Kartikeya Parashar
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Builder going deeper. Founder of 21 AI products at Kaydenlabs. Going
          from generalist to specialist in AI engineering.
        </p>
      </section>

      <Separator />

      {/* Section 2: Brief background */}
      <section className="py-12">
        <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight">
          Background
        </h2>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            I&apos;ve shipped 21 AI products over the last two years across
            fintech, legal tech, estate administration, content creation, social
            media, real estate, and tax. The flagships, WealthPilot (autonomous
            trading), Hermes Agent System (multi-agent OS), and LastingPath
            (estate admin, live at{" "}
            <Link
              href="https://lastingpath.com"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              lastingpath.com
            </Link>
            ), are where the depth lives. Currently VP Applied AI at Onclave.
          </p>
          <p>
            Last month I realized I was a mile wide and an inch deep. I know how
            to ship an LLM product. I don&apos;t yet know how to architect one
            for a Fortune 500 customer with security, compliance, and SOC2
            constraints. So I&apos;m spending the next 12 months going deeper.
            Field Notes is the public layer.
          </p>
        </div>
      </section>

      <Separator />

      {/* Section 3: Why FDE */}
      <section className="py-12">
        <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight">
          Why Forward Deployed Engineering
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Shipping 21 products taught me how systems break in production. The
          retrieval pipeline that worked in dev, the agent loop that drifted
          under real customer data, the kill-switch you needed at 2am. I want to
          do that work for customers operating at scale instead of for my own
          portfolio. Forward Deployed Engineer is the role that maps to that
          ambition: sit with the customer, find what is actually broken, build
          the system that fixes it, take the production pager.
        </p>
      </section>

      <Separator />

      {/* Section 4: Currently learning */}
      <section className="py-12">
        <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight">
          Currently learning
        </h2>
        <ul className="max-w-3xl space-y-3 text-base leading-relaxed text-muted-foreground">
          {LEARNING_BULLETS.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      {/* Section 5: Flagships */}
      <section className="py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Flagships
          </h2>
          <Link
            href="https://kaydenlabs.com/work"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Full portfolio →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FLAGSHIPS.map((p) => (
            <Card key={p.title} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  <Link
                    href={p.href}
                    className="text-foreground hover:text-foreground/80"
                  >
                    {p.title}
                  </Link>
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {p.blurb}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link
                  href={p.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  View →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Section 6: Full portfolio + contact */}
      <section className="py-12">
        <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight">
          Elsewhere
        </h2>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            See the full portfolio:{" "}
            <Link
              href="https://kaydenlabs.com/work"
              className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              Kaydenlabs / Work →
            </Link>
          </p>
          <p>
            Current role:{" "}
            <span className="text-foreground">VP Applied AI at Onclave</span>.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/40"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Email
          </Link>
          {github ? (
            <Link
              href={github}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/40"
            >
              <Code className="h-4 w-4" aria-hidden />
              GitHub
            </Link>
          ) : null}
          {linkedin ? (
            <Link
              href={linkedin}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/40"
            >
              <Briefcase className="h-4 w-4" aria-hidden />
              LinkedIn
            </Link>
          ) : null}
          {kaydenlabs ? (
            <Link
              href={kaydenlabs}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/40"
            >
              <Globe className="h-4 w-4" aria-hidden />
              Kaydenlabs
            </Link>
          ) : null}
        </div>
      </section>

      <Separator />

      {/* Closing */}
      <section className="py-16">
        <p className="text-center text-sm italic text-muted-foreground">
          The work is the goal. The doors open from the work.
        </p>
      </section>
    </div>
  );
}
