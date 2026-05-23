import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY missing — server-only operations cannot run.");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export type CaseStudyStatus = "planned" | "research" | "building" | "writing" | "published";

export type CaseStudy = {
  id: number;
  title: string;
  one_line_summary: string;
  status: CaseStudyStatus;
  tags: string[] | null;
  target_completion_date: string | null;
  published_date: string | null;
  github_url: string | null;
  detail_slug: string;
  hero_image_url: string | null;
};

export type DailyLog = {
  id: string;
  user_id: string;
  log_date: string;
  hours_logged: number | null;
  streak_held: boolean;
  concepts_added: number;
  problems_solved: number;
  content_published: number;
  mock_score: number | null;
  mock_category: string | null;
  activity_description: string | null;
  case_study_id: number | null;
  case_study_progress: number | null;
  milestone_hit: string | null;
  created_at: string;
};

export type User = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  created_at: string;
};
