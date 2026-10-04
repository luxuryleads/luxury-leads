# Luxury Leads — Production Scaffold

QR open-house lead capture SaaS for real estate agents. Visitors scan a QR code
to sign in → each lead is scored **hot / warm / cold** → per-tier automated
email follow-up runs for up to 6 months. Plus an embeddable website widget and a
public landing page that positions against Ylopo and Curb Hero.

## Run it locally

```bash
cd ~/workspace/goals/luxury-leads-real-estate-saas/app
cp -n .env.example .env   # first time only
npm install
npx prisma db push        # creates tables in your Postgres DATABASE_URL
npx prisma db seed        # 21 email sequences + demo agent/open house
npm run dev               # http://localhost:3000
```

Demo login: **demo@luxuryleads.local** / **demo1234**
Demo capture page: **/capture/demo-open-house**

Verify the production build compiles:

```bash
npm run build
```

## What was built

**Pages / routes**

| Route | What it does |
|---|---|
| `/` | Public landing: hero, features, **Us vs Them** (Luxury Leads vs Ylopo vs Curb Hero), pricing ($19 / $39 / $99 — set deliberately below both competitors) |
| `/signup`, `/login` | Agent auth (email + password, bcrypt-hashed) |
| `/dashboard` | Lead stats, open-house list, latest leads table with score badges, website-widget embed snippet |
| `/dashboard/open-houses/new` | Create an open house → generates its QR slug |
| `/dashboard/open-houses/[id]` | QR code (generated client-side), capture URL, leads for that house |
| `/capture/[qrSlug]` | Public sign-in form (the QR target). Creates the lead, assigns the score, fires Day-0 emails, shows thank-you |
| `/widget/[agentId]` | Compact capture form for embedding; `?openHouse=QR_SLUG` pins a specific house |
| `POST /api/auth/signup|login|logout` | Session auth (httpOnly cookie, 30-day DB sessions) |
| `GET/POST /api/open-houses` | Agent's open houses (auth required) |
| `POST /api/leads` | Public capture endpoint (used by form + widget) |
| `POST /api/cron/process-sequences` | Sends due drip emails. Call daily from a scheduler; optional `CRON_SECRET` |

**Core modules (`src/lib/`)**

- `scoring.ts` — ★ **lead-scoring rules live here, clearly marked for tweaking.** HOT = buying ≤30 days + pre-approved; WARM = ≤30 days not pre-approved, or 2–6 months; COLD = 6+ months / browsing. Returns score + human-readable reasons.
- `email.ts` — merge-tag renderer (`{{first_name}}`, `{{agent_name}}`, `{{agent_phone}}`, `{{agent_email}}`, `{{brokerage}}`, `{{property_address}}`, `{{property_price}}`) + **Resend stub**.
- `sequences.ts` — finds due emails per lead tier/day-offset and sends via the email service; records every attempt in `EmailLog`.
- `auth.ts`, `prisma.ts` — session helpers, Prisma client singleton.

**Data**

- `prisma/schema.prisma` — Agent, Session, OpenHouse, Lead, EmailSequence, EmailLog. Postgres in production; no Postgres-only column types. (Scores/statuses are plain Strings with documented values, enforced in TypeScript — see `src/lib/scoring.ts`.) A zero-setup SQLite fallback for local dev is documented at the top of the schema file.
- `prisma/seed-data.ts` — auto-generated from `../files/drip-email-copy.md` (all 21 emails: 7 hot/30d, 8 warm/60d, 6 cold/180d). Regenerate with `node scripts/parse-drip.mjs` if the copy changes.
- `prisma/seed.ts` — idempotent seed: upserts sequences, creates demo agent + demo open house.

## What's stubbed (not live yet)

- **Resend** — `src/lib/email.ts` is a stub: with no `RESEND_API_KEY` it logs and records `SKIPPED`, so sequences can be tested end-to-end without sending anything. "Connect key to go live" — set the key + `RESEND_FROM_EMAIL`, no code changes needed. Also add the unsubscribe footer + sender address before launch (CASL requirement — flagged in the drip copy review checklist).
- **Stripe** — subscription billing is not wired up. Keys are placeholders in `.env.example`. The pricing page is marketing-only until billing is integrated.
- **Auth** — simple credentials sessions, fine for scaffold/MVP. Migrate to NextAuth/Auth.js or a hosted provider before real launch.

## Account checklist to go live

1. **Stripe** — create account, add secret/publishable/webhook keys to env, integrate checkout + webhooks for the 3 tiers.
2. **Domain** — ⚠️ `luxuryleads.com` looks taken (a Belgian luxury real-estate firm already operates under that name). Plan on `getluxuryleads.com` or similar; check availability before spending on branding.
3. **Hosting** — deploy (e.g. Vercel), switch `DATABASE_URL` to Postgres, set `APP_URL`, run `prisma db push` + `db seed` against prod.
4. **Resend** — create account, verify sending domain, set `RESEND_API_KEY` + `RESEND_FROM_EMAIL`; add unsubscribe footer to templates (CASL).
5. **Scheduler** — point a daily cron at `POST /api/cron/process-sequences` (set `CRON_SECRET`).

## Smoke-tested

`npm run build` ✅ · landing + capture pages 200 ✅ · lead capture → HOT score + Day-0 stub ✅ · signup/login/session ✅ · open-house create ✅ · widget 200 ✅ · cron route ✅
