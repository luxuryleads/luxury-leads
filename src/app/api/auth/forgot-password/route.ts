// Request a password reset email. Always returns ok so we don't reveal
// which email addresses have accounts.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { passwordResetUrl } from '@/lib/password-reset';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (typeof email === 'string' && email.includes('@')) {
    const agent = await prisma.agent.findUnique({ where: { email } });
    if (agent) {
      const url = passwordResetUrl(agent.id);
      await sendEmail({
        to: agent.email,
        subject: 'Reset your Luxury Leads password',
        text:
          `Hey ${agent.name},\n\n` +
          `Someone requested a password reset for your Luxury Leads account. ` +
          `Click the link below to set a new password — it expires in 1 hour:\n\n` +
          `${url}\n\n` +
          `If you didn't request this, just ignore this email. Your password won't change.`,
        fromName: 'Luxury Leads',
      });
    }
  }

  return NextResponse.json({ ok: true });
}
