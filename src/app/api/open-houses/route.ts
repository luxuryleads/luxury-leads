import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentAgent } from '@/lib/auth';

export async function GET() {
  const agent = await getCurrentAgent();
  if (!agent) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const openHouses = await prisma.openHouse.findMany({
    where: { agentId: agent.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { leads: true } },
    },
  });
  return NextResponse.json({ openHouses });
}

export async function POST(req: Request) {
  const agent = await getCurrentAgent();
  if (!agent) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const { propertyAddress, propertyPrice, date } = await req.json();
  if (!propertyAddress) {
    return NextResponse.json({ error: 'Property address is required.' }, { status: 400 });
  }

  // Short, URL-safe slug for the QR code. Collisions are retried once.
  let qrSlug = randomBytes(4).toString('hex');
  if (await prisma.openHouse.findUnique({ where: { qrSlug } })) {
    qrSlug = randomBytes(6).toString('hex');
  }

  const openHouse = await prisma.openHouse.create({
    data: {
      agentId: agent.id,
      propertyAddress,
      propertyPrice: propertyPrice || null,
      date: date ? new Date(date) : null,
      qrSlug,
    },
  });
  return NextResponse.json({ ok: true, openHouse });
}
