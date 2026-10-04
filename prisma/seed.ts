// Seeds the default email sequences (from the approved drip copy) plus a demo
// agent + open house so the app is explorable right after `prisma db push`.
// Idempotent — safe to re-run.
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { EMAIL_SEQUENCES } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  // ── Email sequences (upsert by tier + dayOffset) ──────────────────────────
  for (const s of EMAIL_SEQUENCES) {
    await prisma.emailSequence.upsert({
      where: { tier_dayOffset: { tier: s.tier, dayOffset: s.dayOffset } },
      update: { subject: s.subject, body: s.body },
      create: { tier: s.tier, dayOffset: s.dayOffset, subject: s.subject, body: s.body },
    });
  }
  console.log(`Seeded ${EMAIL_SEQUENCES.length} email sequences.`);

  // ── Demo agent (clearly fake — delete before launch) ───────────────────────
  const demoEmail = 'demo@luxuryleads.local';
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const agent = await prisma.agent.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      name: 'Demo Agent',
      email: demoEmail,
      passwordHash,
      brokerage: 'Luxury Leads Realty',
      phone: '(555) 010-2030',
    },
  });

  // ── Demo open house ────────────────────────────────────────────────────────
  await prisma.openHouse.upsert({
    where: { qrSlug: 'demo-open-house' },
    update: {},
    create: {
      agentId: agent.id,
      propertyAddress: '123 Palm Court, Beverly Hills, CA 90210',
      propertyPrice: '$2,450,000',
      date: new Date(Date.now() + 2 * 24 * 3600 * 1000),
      qrSlug: 'demo-open-house',
    },
  });

  console.log('Demo agent ready: demo@luxuryleads.local / demo1234');
  console.log('Demo capture page: /capture/demo-open-house');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
