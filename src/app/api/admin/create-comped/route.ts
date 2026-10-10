// Admin: create a free partner account with a temporary password.
// The partner logs in and changes it from their dashboard.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { verifyAdminSecret } from '@/lib/admin';

export async function POST(req: Request) {
  const { secret, name, email, password } = await req.json();

  if (!verifyAdminSecret(secret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await prisma.agent.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'An account with that email already exists — use "Comp existing account" instead.' },
      { status: 409 }
    );
  }

  const agent = await prisma.agent.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      plan: 'comped',
    },
  });

  return NextResponse.json({
    ok: true,
    agent: { id: agent.id, name: agent.name, email: agent.email, plan: agent.plan },
  });
}
