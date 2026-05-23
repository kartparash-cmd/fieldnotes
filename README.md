# Field Notes

> Builder going deeper.

The public-facing tracker site for a 12-month deliberate practice journey from AI generalist to specialist. Lives at [`fieldnotes.kaydenlabs.com`](https://fieldnotes.kaydenlabs.com).

This is also Case Study #7 of the journey — `/case-studies/tracker-build` — a writeup of building and dogfooding the tracker itself.

## What it is

A focused, $0/month portfolio + accountability site:

- **Case Studies portfolio** (`/case-studies`) — 6 + 1 production AI engineering case studies, each grounded in a real shipped product
- **Journey dashboard** (`/journey`) — daily hours, streak, activity heatmap, side-by-side comparison with my accountability partner
- **Notes** (`/notes`) — curated published writeups (lands in Weekend 2)
- **Admin** (`/admin`) — single-password-protected daily logging form

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui (slate base color) |
| Database | Supabase (PostgreSQL with RLS) |
| Charts / visuals | Recharts, react-activity-calendar |
| MDX | next-mdx-remote (RSC variant) |
| Icons | lucide-react |
| Date utilities | date-fns |
| Hosting | Vercel |
| Dev runner | npm + tsx (for seed script) |

Total infra cost: $0/mo on free tiers.

## Data model

Three tables — see `supabase/migrations/001_initial.sql`:

- `users` (2 rows: me + Bharat)
- `case_studies` (7 rows: the case study portfolio, manually maintained)
- `daily_logs` (one row per user per day per update — the atomic data point)

RLS enabled on all three tables with anon SELECT policies. All writes flow through the service role key from the `/admin` route, which is protected by `ADMIN_PASSWORD`.

## Local setup

```bash
# 1. Clone
git clone https://github.com/kartparash-cmd/fieldnotes.git
cd fieldnotes

# 2. Install
npm install

# 3. Configure env
cp .env.example .env.local
# Then fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, and ADMIN_PASSWORD

# 4. Apply schema in Supabase SQL editor
# Copy contents of supabase/migrations/001_initial.sql and run

# 5. Seed
npx tsx scripts/seed.ts

# 6. Develop
npm run dev
# → http://localhost:3000
```

## Project layout

```
src/
├── app/
│   ├── layout.tsx              # site shell (header + footer)
│   ├── page.tsx                # landing
│   ├── case-studies/
│   │   ├── page.tsx            # portfolio grid
│   │   └── [slug]/page.tsx     # MDX detail
│   ├── admin/
│   │   ├── page.tsx            # daily log form (use client)
│   │   └── login/page.tsx
│   ├── journey/page.tsx        # metrics dashboard
│   └── api/admin/{auth,logs}/route.ts
├── components/
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── hero-stats.tsx
│   ├── phase-progress.tsx
│   ├── activity-heatmap.tsx    # use client (react-activity-calendar)
│   ├── comparison-view.tsx
│   ├── recent-activity.tsx
│   └── ui/                     # shadcn primitives
├── content/case-studies/       # 7 MDX writeups (placeholders for now)
├── lib/
│   ├── supabase.ts             # anon + service role clients, types
│   ├── config.ts               # SITE_CONFIG, phase math
│   └── milestones.ts           # 21-milestone timeline
└── middleware.ts               # cookie auth for /admin
scripts/
└── seed.ts                     # users + case_studies seed
supabase/
└── migrations/001_initial.sql
```

## Auth model

Intentionally minimal: a single shared password (`ADMIN_PASSWORD`) gates `/admin/*` via httpOnly + sameSite=strict + secure cookie. Two known users (me + Bharat) share it. This is not Supabase Auth — for a 2-user accountability site, full auth would be over-engineering. See `DEPLOY.md` for how to rotate the password.

## What's intentionally NOT here

Per the original spec (`03-tracker-spec.md` → "Things you will be tempted to add that you must not"):

- ❌ User signups / multi-tenancy
- ❌ Comments / social features
- ❌ Email notifications
- ❌ Mobile app
- ❌ Public API
- ❌ In-app markdown editor (MDX files in repo are the CMS)
- ❌ Analytics dashboards for visitors (Vercel Analytics is free; enable it, don't build it)

The single allowed addition Month 6+: a "concepts mastered" page pulled from an Obsidian vault via GitHub Action. Nothing else.

## Build & deploy

See [`DEPLOY.md`](./DEPLOY.md) for full Vercel deployment instructions including env var configuration and DNS setup for `fieldnotes.kaydenlabs.com`.

## License

MIT — see [LICENSE](./LICENSE).

Built in public. The work is the goal. The doors open from the work.
