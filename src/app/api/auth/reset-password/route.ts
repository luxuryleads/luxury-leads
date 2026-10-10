// Set a new password from a reset token. Invalidates all sessions so the
// old password can't be used anywhere.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { verifyPasswordResetToken } from '@/lib/password-reset';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  const agentId = typeof token === 'string' ? verifyPasswordResetToken(token) : null;
  if (!agentId) {
    return NextResponse.json({ error: 'This reset link is invalid or expired.' }, { status: 400 });
  }
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
  }

  await prisma.agent.update({
    where: { id: agentId },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  await prisma.session.deleteMany({ where: { agentId } });

  return NextResponse.json({ ok: true });
}
