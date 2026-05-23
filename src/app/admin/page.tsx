"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, type CaseStudy, type User } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function todayYMD(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const MOCK_CATEGORIES = [
  { value: "behavioral", label: "Behavioral" },
  { value: "coding", label: "Coding" },
  { value: "llm-sd", label: "LLM System Design" },
  { value: "classical-sd", label: "Classical System Design" },
  { value: "customer-demo", label: "Customer Demo" },
] as const;

const SELECT_CLASS =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

const TEXTAREA_CLASS =
  "min-h-24 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

type FormState = {
  user_id: string;
  log_date: string;
  hours_logged: string;
  streak_held: boolean;
  concepts_added: string;
  problems_solved: string;
  content_published: string;
  mock_score: string; // "none" | "1".."5"
  mock_category: string; // "none" | category value
  case_study_id: string; // "none" | numeric id
  case_study_progress: string;
  milestone_hit: string;
  activity_description: string;
};

function initialState(userId = ""): FormState {
  return {
    user_id: userId,
    log_date: todayYMD(),
    hours_logged: "",
    streak_held: false,
    concepts_added: "0",
    problems_solved: "0",
    content_published: "0",
    mock_score: "none",
    mock_category: "none",
    case_study_id: "none",
    case_study_progress: "",
    milestone_hit: "",
    activity_description: "",
  };
}

export default function AdminPage() {
  const [users, setUsers] = useState<Pick<User, "id" | "username" | "display_name">[]>([]);
  const [caseStudies, setCaseStudies] = useState<Pick<CaseStudy, "id" | "title">[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(initialState());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingMeta(true);
      setMetaError(null);
      const [usersRes, csRes] = await Promise.all([
        supabase.from("users").select("id, username, display_name").order("username"),
        supabase.from("case_studies").select("id, title").order("id"),
      ]);
      if (cancelled) return;
      if (usersRes.error) {
        setMetaError(`Failed to load users: ${usersRes.error.message}`);
      } else {
        const list = usersRes.data ?? [];
        setUsers(list);
        setForm((prev) =>
          prev.user_id ? prev : { ...prev, user_id: list[0]?.id ?? "" }
        );
      }
      if (csRes.error) {
        setMetaError((prev) =>
          prev ?? `Failed to load case studies: ${csRes.error!.message}`
        );
      } else {
        setCaseStudies(csRes.data ?? []);
      }
      setLoadingMeta(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultUserId = useMemo(() => users[0]?.id ?? "", [users]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function parseIntOrZero(s: string): number {
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : 0;
  }

  function parseNumOrNull(s: string): number | null {
    if (s.trim() === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function parseProgress(s: string): number | null {
    if (s.trim() === "") return null;
    const n = parseInt(s, 10);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(100, n));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!form.user_id) {
      setMessage({ kind: "error", text: "Please select a user." });
      return;
    }
    if (!form.log_date) {
      setMessage({ kind: "error", text: "Please pick a date." });
      return;
    }

    const payload = {
      user_id: form.user_id,
      log_date: form.log_date,
      hours_logged: parseNumOrNull(form.hours_logged),
      streak_held: form.streak_held,
      concepts_added: parseIntOrZero(form.concepts_added),
      problems_solved: parseIntOrZero(form.problems_solved),
      content_published: parseIntOrZero(form.content_published),
      mock_score: form.mock_score === "none" ? null : parseInt(form.mock_score, 10),
      mock_category: form.mock_category === "none" ? null : form.mock_category,
      case_study_id:
        form.case_study_id === "none" ? null : parseInt(form.case_study_id, 10),
      case_study_progress: parseProgress(form.case_study_progress),
      milestone_hit: form.milestone_hit.trim() === "" ? null : form.milestone_hit.trim(),
      activity_description:
        form.activity_description.trim() === "" ? null : form.activity_description.trim(),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage({ kind: "success", text: "Logged." });
        // Reset counts and description; keep user + date.
        setForm({
          ...initialState(form.user_id || defaultUserId),
          user_id: form.user_id || defaultUserId,
          log_date: form.log_date,
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({
          kind: "error",
          text: data?.detail || data?.error || `Request failed (${res.status}).`,
        });
      }
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Network error.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Admin — Daily Log</h1>
          <p className="text-sm text-muted-foreground">
            One row per user per day. Aggregates feed /journey.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
          <CardDescription>Capture today&apos;s work.</CardDescription>
        </CardHeader>
        <CardContent>
          {metaError ? (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {metaError}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="user_id">User</Label>
                <select
                  id="user_id"
                  className={SELECT_CLASS}
                  value={form.user_id}
                  onChange={(e) => update("user_id", e.target.value)}
                  disabled={loadingMeta || users.length === 0}
                  required
                >
                  {users.length === 0 ? (
                    <option value="">No users found</option>
                  ) : (
                    users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} — {u.display_name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="log_date">Date</Label>
                <input
                  id="log_date"
                  type="date"
                  className={SELECT_CLASS}
                  value={form.log_date}
                  onChange={(e) => update("log_date", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="hours_logged">Hours logged</Label>
                <Input
                  id="hours_logged"
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  placeholder="e.g. 3.5"
                  value={form.hours_logged}
                  onChange={(e) => update("hours_logged", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="cursor-pointer" htmlFor="streak_held">
                  Streak
                </Label>
                <label
                  htmlFor="streak_held"
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm cursor-pointer dark:bg-input/30"
                  )}
                >
                  <input
                    id="streak_held"
                    type="checkbox"
                    className="size-4 rounded border-input accent-primary"
                    checked={form.streak_held}
                    onChange={(e) => update("streak_held", e.target.checked)}
                  />
                  <span>Held today</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="concepts_added">Concepts added</Label>
                <Input
                  id="concepts_added"
                  type="number"
                  min="0"
                  step="1"
                  value={form.concepts_added}
                  onChange={(e) => update("concepts_added", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="problems_solved">Problems solved</Label>
                <Input
                  id="problems_solved"
                  type="number"
                  min="0"
                  step="1"
                  value={form.problems_solved}
                  onChange={(e) => update("problems_solved", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="content_published">Content published</Label>
                <Input
                  id="content_published"
                  type="number"
                  min="0"
                  step="1"
                  value={form.content_published}
                  onChange={(e) => update("content_published", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="mock_score">Mock score</Label>
                <select
                  id="mock_score"
                  className={SELECT_CLASS}
                  value={form.mock_score}
                  onChange={(e) => update("mock_score", e.target.value)}
                >
                  <option value="none">None</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="mock_category">Mock category</Label>
                <select
                  id="mock_category"
                  className={SELECT_CLASS}
                  value={form.mock_category}
                  onChange={(e) => update("mock_category", e.target.value)}
                >
                  <option value="none">None</option>
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="case_study_id">Case study</Label>
                <select
                  id="case_study_id"
                  className={SELECT_CLASS}
                  value={form.case_study_id}
                  onChange={(e) => update("case_study_id", e.target.value)}
                >
                  <option value="none">None</option>
                  {caseStudies.map((cs) => (
                    <option key={cs.id} value={String(cs.id)}>
                      #{cs.id} — {cs.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="case_study_progress">Case study progress (%)</Label>
                <Input
                  id="case_study_progress"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0-100 (optional)"
                  value={form.case_study_progress}
                  onChange={(e) => update("case_study_progress", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="milestone_hit">Milestone hit (optional)</Label>
              <Input
                id="milestone_hit"
                type="text"
                placeholder="e.g. AWS SAA passed"
                value={form.milestone_hit}
                onChange={(e) => update("milestone_hit", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="activity_description">Activity description</Label>
              <textarea
                id="activity_description"
                className={TEXTAREA_CLASS}
                placeholder="What did you build, read, or solve today?"
                value={form.activity_description}
                onChange={(e) => update("activity_description", e.target.value)}
              />
            </div>

            {message ? (
              <p
                className={cn(
                  "text-sm",
                  message.kind === "success" ? "text-foreground" : "text-destructive"
                )}
                role={message.kind === "error" ? "alert" : "status"}
              >
                {message.text}
              </p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || loadingMeta}>
                {submitting ? "Saving..." : "Log entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
