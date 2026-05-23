export const SITE_CONFIG = {
  name: "Field Notes",
  tagline: "Builder going deeper.",
  description:
    "Field notes from year one of specializing in AI engineering. Founder of six AI products learning what production deployment really looks like.",
  url: "https://fieldnotes.kaydenlabs.com",
  author: {
    name: "Kartikeya Parashar",
    email: "kart.parash@gmail.com",
    twitter: "",
    github: "",
    linkedin: "",
  },
};

export type Phase = {
  number: 1 | 2 | 3 | 4;
  name: string;
  theme: string;
  startMonth: number;
  endMonth: number;
};

export const PHASES: Phase[] = [
  { number: 1, name: "Foundations", theme: "Mental models. Habit formation. CS1 published.", startMonth: 1, endMonth: 3 },
  { number: 2, name: "Patterns", theme: "Multiple case studies in flight. AWS SAA. The hard middle.", startMonth: 4, endMonth: 6 },
  { number: 3, name: "Production", theme: "Customer skills. Safety. Open source. CS4, CS5, CS6.", startMonth: 7, endMonth: 9 },
  { number: 4, name: "Interviews", theme: "Application sprint. Mock intensive. Behavioral STAR mastery.", startMonth: 10, endMonth: 12 },
];

export const JOURNEY_START = new Date("2026-05-25T00:00:00Z");
export const JOURNEY_END = new Date("2027-05-24T00:00:00Z");

export function getCurrentPhase(now: Date = new Date()): Phase {
  const monthsIn = Math.floor((now.getTime() - JOURNEY_START.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const monthNumber = Math.max(1, Math.min(12, monthsIn + 1));
  return PHASES.find((p) => monthNumber >= p.startMonth && monthNumber <= p.endMonth) ?? PHASES[0];
}

export function getCurrentPhaseProgress(now: Date = new Date()): number {
  const phase = getCurrentPhase(now);
  const phaseStart = new Date(JOURNEY_START);
  phaseStart.setMonth(phaseStart.getMonth() + (phase.startMonth - 1));
  const phaseEnd = new Date(JOURNEY_START);
  phaseEnd.setMonth(phaseEnd.getMonth() + phase.endMonth);
  const total = phaseEnd.getTime() - phaseStart.getTime();
  const elapsed = now.getTime() - phaseStart.getTime();
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

export const CURRENT_WEEK_TARGET = "Week 1: Vault operational. Field Notes MVP deployed. Karpathy intro + GPT video + Illustrated Transformer ingested.";
