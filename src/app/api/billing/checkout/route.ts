// POST /api/billing/checkout { plan: 'starter' | 'pro' | 'team' }
// Creates a Stripe Checkout Session for the logged-in agent's subscription.
// If the agent is still inside the 14-day cardless trial, the subscription
// inherits the remaining trial time (trial_end), so they aren't double-billed.
import { NextResponse } from 'next/server';
import { getStripe, priceIdFor, appUrl, isTrialActive, PLANS, PlanId } from '@/lib/billing';
import { getCurrentAgent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const agent = await getCurrentAgent();
  if (!agent) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });


  let plan: string;
  let referral: string | undefined;
  try {
    ({ plan, referral } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!plan || !(plan in PLANS)) {
    return NextResponse.json({ error: 'Pick a valid plan.' }, { status: 400 });
  }
  const planId = plan as PlanId;


  let stripe;
  let priceId: string;
  try {
    stripe = getStripe();
    priceId = priceIdFor(planId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Billing is not configured yet.' },
      { status: 500 }
    );
  }
  // Reuse the Stripe customer if we already made one for this agent.
  let customerId = agent.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: agent.email,
      name: agent.name,
      metadata: { agentId: agent.id },
    });
    customerId = customer.id;
    await prisma.agent.update({ where: { id: agent.id }, data: { stripeCustomerId: customerId } });
  }


  const subscriptionData: Record<string, unknown> = {
    metadata: { agentId: agent.id, plan: planId },
  };
  // Honor the remaining cardless trial instead of charging immediately.
  if (isTrialActive(agent.trialEndsAt) && !agent.stripeSubscriptionId) {
    subscriptionData.trial_end = Math.floor(agent.trialEndsAt!.getTime() / 1000);
  }


  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    // No card required while the trial means nothing is due today; Stripe
    // still collects a card when payment is actually due (trial expired).
    payment_method_collection: 'if_required',
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: subscriptionData,
    // Rewardful affiliate referral when present (their Stripe integration
    // matches on this); falls back to the agent id otherwise. The webhook
    // reads the agent from metadata, so this is safe to repurpose.
    client_reference_id: referral || agent.id,
    metadata: { agentId: agent.id, plan: planId },
    success_url: `${appUrl()}/dashboard?billing=success`,
    cancel_url: `${appUrl()}/#pricing`,
  });


  return NextResponse.json({ url: session.url });
}
