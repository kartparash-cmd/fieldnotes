# Deploy

Step-by-step deploy of Field Notes to Vercel. Run these from `~/Documents/code/fieldnotes/`.

## Prerequisites

- Vercel account linked to your GitHub
- DNS configured: `fieldnotes.kaydenlabs.com` CNAME → `cname.vercel-dns.com` (propagation may take a few minutes to a few hours)
- Supabase project already provisioned with schema applied and seed data loaded

## Option A: Deploy via Vercel CLI (recommended for first deploy)

```bash
# 1. Install Vercel CLI globally if you don't have it
npm install -g vercel

# 2. Log in
vercel login

# 3. Link this directory to a Vercel project (first time only)
vercel link
# Choose: scope = your account, link to existing? No, project name = fieldnotes

# 4. Push environment variables to Vercel (production + preview + development)
vercel env add NEXT_PUBLIC_SUPABASE_URL
# paste: https://nhtulkbvccyjlxcevglt.supabase.co
# select: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# paste the anon key from .env.local
# select: Production, Preview, Development

vercel env add SUPABASE_SERVICE_ROLE_KEY
# paste the service_role key
# select: Production, Preview (Development uses .env.local)

vercel env add ADMIN_PASSWORD
# IMPORTANT: do NOT reuse `tapasya-local-only-change-me-in-prod`.
# Generate a strong random password:
#   openssl rand -base64 32
# Paste that value.
# select: Production, Preview

# 5. First production deploy
vercel --prod

# Vercel returns a deploy URL like https://fieldnotes-abc123.vercel.app
# The build runs `npm run build` automatically. Should take 60-90s.
```

## Option B: Deploy via Vercel Dashboard

1. Push this repo to GitHub (already done at `github.com/kartparash-cmd/fieldnotes`)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the `fieldnotes` repo
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: leave as `./`
6. Build Command: `npm run build` (default)
7. Add Environment Variables (all four):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (generate fresh — DO NOT reuse the local one)
8. Click **Deploy**

## Attach the custom domain

After the first deploy succeeds:

1. In the Vercel dashboard → Project → Settings → Domains
2. Add `fieldnotes.kaydenlabs.com`
3. Vercel will verify the DNS CNAME (you already configured it pointing at `cname.vercel-dns.com`)
4. Once verified, SSL provisions automatically (1-5 minutes)

## Verify the deploy

Open in order:

- [https://fieldnotes.kaydenlabs.com](https://fieldnotes.kaydenlabs.com) → landing renders, "Field Notes / Builder going deeper." visible
- `/case-studies` → 7 case study cards (all "planned" status)
- `/case-studies/enterprise-rag` → MDX placeholder for CS1 renders
- `/journey` → empty heatmap, all stats at 0 (correct — no daily logs yet)
- `/admin/login` → password form
- `/admin` (after login with your Vercel `ADMIN_PASSWORD`) → daily log form
- Submit a test row via `/admin`. Verify it appears in `/journey` and on the landing page's "Latest" section.

## Rotate secrets after first deploy

The `service_role` key was shared in a Claude chat session during initial build. Rotate it before going public:

1. Supabase Dashboard → project `nhtulkbvccyjlxcevglt` → Settings → API
2. Click **Reset service_role key**
3. Copy the new value
4. In Vercel: Settings → Environment Variables → edit `SUPABASE_SERVICE_ROLE_KEY` → paste new value
5. Trigger a redeploy (Vercel → Deployments → latest → "Redeploy")
6. Update your local `.env.local` with the new key

## Future deploys

Every push to `main` triggers a production deploy automatically via Vercel's GitHub integration. Every push to any other branch creates a preview deploy at a unique URL.

To redeploy without code changes (e.g., after changing env vars):
- Vercel Dashboard → Project → Deployments → latest → "Redeploy"
- Or CLI: `vercel --prod`

## Monitoring

Enable Vercel Analytics (free tier — Vercel Dashboard → Project → Analytics → Enable). Don't build your own visitor dashboard. The spec explicitly forbids it.

## Disaster recovery

- Repo: `github.com/kartparash-cmd/fieldnotes`
- Schema: `supabase/migrations/001_initial.sql` (commit history is the source of truth)
- Seed data: `scripts/seed.ts` — re-runnable, uses `upsert`
- Daily logs are user-generated and cannot be regenerated. Take regular Supabase backups (free tier includes daily snapshots; configurable in Supabase → Database → Backups).
