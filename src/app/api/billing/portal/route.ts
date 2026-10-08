// POST /api/billing/portal
// Creates a Stripe Customer Portal session so the agent can update their
// card, change plans, or cancel — all inside Stripe's hosted UI.
import { NextResponse } from 'next/server';
import { getCurrentAgent } from '@/lib/auth';
import { getStripe, appUrl } from '@/lib/billing';

export async function POST() {
  const agent = await getCurrentAgent();
  if (!agent) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  if (!agent.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account yet — pick a plan first.' }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: agent.stripeCustomerId,
    return_url: `${appUrl()}/dashboard`,
  });
  return NextResponse.json({ url: session.url });
}
