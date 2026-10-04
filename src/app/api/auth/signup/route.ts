import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { name, email, password, brokerage, phone } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await prisma.agent.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
  }

  const agent = await prisma.agent.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      brokerage: brokerage || null,
      phone: phone || null,
    },
  });

  await createSession(agent.id);
  return NextResponse.json({ ok: true, agent: { id: agent.id, name: agent.name, email: agent.email } });
}
