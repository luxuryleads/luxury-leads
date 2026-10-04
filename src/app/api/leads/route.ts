import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreLead, type TimelineAnswer } from '@/lib/scoring';
import { processDueSequences } from '@/lib/sequences';

const VALID_TIMELINES: TimelineAnswer[] = ['lt_30_days', 'two_six_months', 'gt_6_months', 'browsing'];

/**
 * Public lead capture. Called by /capture/[qrSlug] and the embeddable widget.
 * Creates the lead, assigns a HOT/WARM/COLD score, and fires the Day-0 emails.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { qrSlug, firstName, lastName, email, phone, timeline, preApproved } = body;

  if (!qrSlug || !firstName) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (!VALID_TIMELINES.includes(timeline)) {
    return NextResponse.json({ error: 'Invalid timeline answer.' }, { status: 400 });
  }

  const openHouse = await prisma.openHouse.findUnique({ where: { qrSlug } });
  if (!openHouse) {
    return NextResponse.json({ error: 'Open house not found.' }, { status: 404 });
  }

  const { score, reasons } = scoreLead({ timeline, preApproved: preApproved === true });

  const lead = await prisma.lead.create({
    data: {
      openHouseId: openHouse.id,
      firstName: String(firstName).trim(),
      lastName: lastName ? String(lastName).trim() : null,
      email: email ? String(email).trim().toLowerCase() : null,
      phone: phone ? String(phone).trim() : null,
      timeline,
      preApproved: preApproved === true,
      score,
      scoreReasons: JSON.stringify(reasons),
    },
  });

  // Fire Day-0 sequence emails (stubbed until RESEND_API_KEY is set).
  // Not awaited to keep the form snappy; failures are recorded in EmailLog.
  processDueSequences([lead.id]).catch((e) => console.error('[sequences]', e));

  return NextResponse.json({ ok: true, score, leadId: lead.id });
}
