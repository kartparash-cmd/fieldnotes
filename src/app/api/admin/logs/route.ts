import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

type LogPayload = {
  user_id?: string;
  log_date?: string;
  hours_logged?: number | null;
  streak_held?: boolean;
  concepts_added?: number;
  problems_solved?: number;
  content_published?: number;
  mock_score?: number | null;
  mock_category?: string | null;
  activity_description?: string | null;
  case_study_id?: number | null;
  case_study_progress?: number | null;
  milestone_hit?: string | null;
};

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get("fn_admin");
  if (!cookie || cookie.value !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: LogPayload;
  try {
    body = (await request.json()) as LogPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.user_id || !body.log_date) {
    return NextResponse.json(
      { error: "missing_required_fields", detail: "user_id and log_date are required" },
      { status: 400 }
    );
  }

  const row = {
    user_id: body.user_id,
    log_date: body.log_date,
    hours_logged: body.hours_logged ?? null,
    streak_held: body.streak_held ?? false,
    concepts_added: body.concepts_added ?? 0,
    problems_solved: body.problems_solved ?? 0,
    content_published: body.content_published ?? 0,
    mock_score: body.mock_score ?? null,
    mock_category: body.mock_category ?? null,
    activity_description: body.activity_description ?? null,
    case_study_id: body.case_study_id ?? null,
    case_study_progress: body.case_study_progress ?? null,
    milestone_hit: body.milestone_hit ?? null,
  };

  let client;
  try {
    client = getServiceClient();
  } catch (e) {
    const message = e instanceof Error ? e.message : "service_client_init_failed";
    return NextResponse.json({ error: "server_misconfigured", detail: message }, { status: 500 });
  }

  const { data, error } = await client
    .from("daily_logs")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "insert_failed", detail: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, row: data });
}
