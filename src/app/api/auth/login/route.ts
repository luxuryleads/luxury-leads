import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const agent = await prisma.agent.findUnique({ where: { email } });
  if (!agent || !(await verifyPassword(password, agent.passwordHash))) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  await createSession(agent.id);
  return NextResponse.json({ ok: true, agent: { id: agent.id, name: agent.name, email: agent.email } });
}
