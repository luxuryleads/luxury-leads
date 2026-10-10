import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const leadId = verifyUnsubscribeToken(token);
  if (!leadId) {
    return new NextResponse('This unsubscribe link is invalid or expired.', {
      status: 400,
    });
  }
  await prisma.lead.update({
    where: { id: leadId },
    data: { unsubscribed: true },
  });
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head>` +
      `<body style="font-family:sans-serif;max-width:560px;margin:80px auto;padding:0 20px;color:#222;">` +
      `<h1>You're unsubscribed.</h1>` +
      `<p>You won't receive any more follow-up emails about this home search. Changed your mind? Just reply to any previous email and ask to be added back.</p>` +
      `</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
