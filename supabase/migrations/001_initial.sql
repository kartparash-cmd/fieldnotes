-- Field Notes — initial schema
-- Three tables: users (2 rows), case_studies (7 rows), daily_logs (one row per user per day per update)
-- RLS enabled; anon role gets SELECT only; writes flow through the service_role key from the admin route.

-- ---------- USERS ----------
create table public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  bio text,
  created_at timestamptz default now()
);

-- ---------- CASE STUDIES ----------
create table public.case_studies (
  id integer primary key,
  title text not null,
  one_line_summary text not null,
  status text not null check (status in ('planned', 'research', 'building', 'writing', 'published')),
  tags text[],
  target_completion_date date,
  published_date date,
  github_url text,
  detail_slug text unique,
  hero_image_url text
);

-- ---------- DAILY LOGS ----------
create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  log_date date not null,
  hours_logged numeric(4,2),
  streak_held boolean default true,
  concepts_added integer default 0,
  problems_solved integer default 0,
  content_published integer default 0,
  mock_score integer check (mock_score between 1 and 5),
  mock_category text check (
    mock_category is null
    or mock_category in ('behavioral', 'coding', 'llm-sd', 'classical-sd', 'customer-demo')
  ),
  activity_description text,
  case_study_id integer references public.case_studies(id) on delete set null,
  case_study_progress integer check (case_study_progress between 0 and 100),
  milestone_hit text,
  created_at timestamptz default now()
);

create index idx_daily_logs_user_date on public.daily_logs(user_id, log_date desc);
create index idx_daily_logs_date on public.daily_logs(log_date desc);

-- ---------- ROW LEVEL SECURITY ----------
-- Site data is intentionally public read. Writes go through the service_role key
-- from the Next.js admin route, which bypasses RLS, so we only need read policies here.

alter table public.users enable row level security;
alter table public.case_studies enable row level security;
alter table public.daily_logs enable row level security;

create policy "public read on users" on public.users for select using (true);
create policy "public read on case_studies" on public.case_studies for select using (true);
create policy "public read on daily_logs" on public.daily_logs for select using (true);
