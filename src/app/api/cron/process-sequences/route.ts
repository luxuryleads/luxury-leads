import { NextResponse } from 'next/server';
import { processDueSequences } from '@/lib/sequences';

/**
 * Daily driver for the drip sequences. Hit this from a scheduler
 * (cron-job.org, Vercel Cron, etc.) once per day. Optionally protected
 * by CRON_SECRET: pass it as ?secret=… or Authorization: Bearer ….
 */
export async function POST(req: Request) {
  const required = process.env.CRON_SECRET;
  if (required) {
    const url = new URL(req.url);
    const provided =
      url.searchParams.get('secret') ??
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (provided !== required) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  const result = await processDueSequences();
  return NextResponse.json({ ok: true, ...result });
}

// Allow simple schedulers that only do GET.
export async function GET(req: Request) {
  return POST(req);
}
