# Deploying Luxury Leads

The app is Postgres-ready. Nothing here buys or configures accounts — do each
step in your own dashboards.

## 1. Create a Postgres database

Pick one and copy its connection string:

- **Vercel Postgres** — easiest if you deploy on Vercel (Storage tab → Create Database → Postgres). The connection string is auto-added as env vars; make sure `DATABASE_URL` is set.
- **Supabase** or **Neon** — free tiers work fine for launch. Use the pooled connection string (port 6543) for serverless.

## 2. Set environment variables

In your hosting provider's project settings (Vercel: Settings → Environment Variables):

| Variable | Required? | Notes |
|---|---|---|
| `DATABASE_URL` | **Yes** | Your Postgres connection string. The app will not start without it. |
| `APP_URL` | **Yes** | `https://your-domain.com` — used for QR codes + email links. No trailing slash. |
| `RESEND_API_KEY` | Before emails | Without it, drip emails log as `SKIPPED` — nothing sends. |
| `RESEND_FROM_EMAIL` | Before emails | Your verified sender address, e.g. `hello@getluxuryleads.com`. |
| `CRON_SECRET` | Recommended | Protects `POST /api/cron/process-sequences` from the public. |
| `STRIPE_SECRET_KEY` | Later | Billing is **not integrated yet** — the pricing page is marketing-only until checkout + webhooks are wired. |
| `STRIPE_PUBLISHABLE_KEY` | Later | Same as above. |
| `STRIPE_WEBHOOK_SECRET` | Later | Same as above. |
| `NEXTAUTH_SECRET` | Later | Reserved for a future auth migration. |

## 3. Create the tables + seed the email sequences

From the `app/` directory, with `DATABASE_URL` pointing at production:

```bash
npx prisma db push
npx prisma db seed
```

- `db push` creates all tables (Agent, Session, OpenHouse, Lead, EmailSequence, EmailLog).
- `db seed` loads the 21 drip emails (7 hot / 8 warm / 6 cold) and a **demo agent + demo open house — delete the demo agent before real use**.

> This project currently uses `db push`, not migration files. When you're ready for a stricter workflow, run `npx prisma migrate dev --name init` once against Postgres to start a migrations history, then use `prisma migrate deploy` in CI.

## 4. Deploy on Vercel

1. Import the repo (root directory: `app/`).
2. Add the env vars from step 2.
3. Build command is `npm run build` — it runs `prisma generate && next build` automatically, so the DB client is always fresh. No other build settings needed.

## 5. Scheduler (daily drip emails)

Point a daily cron at:

```
POST https://your-domain.com/api/cron/process-sequences
```

Options: Vercel Cron (`vercel.json`), cron-job.org, or any scheduler. If you set `CRON_SECRET`, send it as the `Authorization: Bearer <secret>` header.

## 6. Before real traffic

- [ ] Delete the demo agent (`demo@luxuryleads.local`) and demo open house
- [ ] Run one test lead capture end-to-end (QR → form → score → dashboard)
- [ ] CASL: add the unsubscribe footer + sender address to email templates (flagged in the drip-copy review)
- [ ] Domain: `luxuryleads.com` looks taken — plan on `getluxuryleads.com` or similar; verify at a registrar before buying
- [ ] Set `APP_URL` to the real domain and re-print QR signs

## Local dev (SQLite fallback)

Production uses Postgres, but you can still hack locally without it:

1. In `prisma/schema.prisma`, temporarily set `provider = "sqlite"`
2. In `.env`, set `DATABASE_URL="file:./dev.db"`
3. Run `npx prisma generate && npx prisma db push && npx prisma db seed`

Flip the provider back to `"postgresql"` before deploying.
