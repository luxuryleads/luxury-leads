// Admin: comp an existing account — flips it to the free partner plan.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSecret } from '@/lib/admin';

export async function POST(req: Request) {
  const { secret, email } = await req.json();

  if (!verifyAdminSecret(secret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const agent = await prisma.agent.findUnique({ where: { email } });
  if (!agent) {
    return NextResponse.json({ error: 'No account found with that email.' }, { status: 404 });
  }

  const updated = await prisma.agent.update({
    where: { id: agent.id },
    data: { plan: 'comped', trialEndsAt: null, subscriptionStatus: null },
  });

  return NextResponse.json({
    ok: true,
    agent: { name: updated.name, email: updated.email, plan: updated.plan },
  });
}
