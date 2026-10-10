// Logged-in agent changes their own password (dashboard).
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAgent, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const agent = await getCurrentAgent();
  if (!agent) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new passwords are required.' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
  }

  const full = await prisma.agent.findUnique({ where: { id: agent.id } });
  if (!full || !(await verifyPassword(currentPassword, full.passwordHash))) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
  }

  await prisma.agent.update({
    where: { id: agent.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return NextResponse.json({ ok: true });
}
