// Finds sequence emails that are due for each lead and sends them through
// the (stubbed) email service. Called from two places:
//   1. Right after a lead is captured (fires the Day-0 emails immediately).
//   2. POST /api/cron/process-sequences (run daily via cron/scheduler).
//
// A sequence is "due" when: lead.createdAt + dayOffset days <= now,
// the lead hasn't unsubscribed, the lead has an email address, and no
// EmailLog row exists yet for (lead, sequence).
import { prisma } from './prisma';
import { renderEmail, sendEmail, type MergeTagValues } from './email';
import { unsubscribeUrl } from './unsubscribe';

const DAY_MS = 24 * 3600 * 1000;

export interface ProcessResult {
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
}

export async function processDueSequences(leadIds?: string[]): Promise<ProcessResult> {
  const result: ProcessResult = { processed: 0, sent: 0, skipped: 0, failed: 0 };
  const now = new Date();

  const leads = await prisma.lead.findMany({
    where: {
      ...(leadIds ? { id: { in: leadIds } } : {}),
      unsubscribed: false,
      email: { not: null },
    },
    include: {
      openHouse: { include: { agent: true } },
      emailLogs: { select: { sequenceId: true } },
    },
  });

  for (const lead of leads) {
    const sequences = await prisma.emailSequence.findMany({
      where: { tier: lead.score },
      orderBy: { dayOffset: 'asc' },
    });
    const alreadySent = new Set(lead.emailLogs.map((l) => l.sequenceId));

    for (const seq of sequences) {
      if (alreadySent.has(seq.id)) continue;
      const dueAt = new Date(lead.createdAt.getTime() + seq.dayOffset * DAY_MS);
      if (dueAt > now) continue;

      result.processed++;
      const tags: MergeTagValues = {
        first_name: lead.firstName,
        agent_name: lead.openHouse.agent.name,
        agent_phone: lead.openHouse.agent.phone ?? '',
        agent_email: lead.openHouse.agent.email,
        brokerage: lead.openHouse.agent.brokerage ?? '',
        property_address: lead.openHouse.propertyAddress,
        property_price: lead.openHouse.propertyPrice ?? '',
      };
      const subject = renderEmail(seq.subject, tags);
      const senderLine = [tags.agent_name, tags.agent_phone, tags.agent_email]
        .filter(Boolean)
        .join(' · ');
      const footer = [
        '',
        '---',
        `You're receiving this because you signed in at an open house with ${tags.agent_name}${tags.brokerage ? ` (${tags.brokerage})` : ''}.`,
        `Unsubscribe: ${unsubscribeUrl(lead.id)}`,
        senderLine,
      ].join('\n');
      const text = renderEmail(seq.body, tags) + footer;

      const send = await sendEmail({ to: lead.email!, subject, text, fromName: tags.agent_name, replyTo: tags.agent_email });

      if (send.skipped) {
        result.skipped++;
        await prisma.emailLog.create({
          data: { leadId: lead.id, sequenceId: seq.id, status: 'SKIPPED', error: send.error },
        });
      } else if (send.ok) {
        result.sent++;
        await prisma.emailLog.create({
          data: { leadId: lead.id, sequenceId: seq.id, status: 'SENT', sentAt: new Date() },
        });
      } else {
        result.failed++;
        await prisma.emailLog.create({
          data: { leadId: lead.id, sequenceId: seq.id, status: 'FAILED', error: send.error },
        });
      }
    }
  }

  return result;
}
