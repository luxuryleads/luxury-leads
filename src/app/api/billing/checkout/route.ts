// POST /api/billing/checkout { plan: 'starter' | 'pro' | 'team' }
// Creates a Stripe Checkout Session for the logged-in agent's subscription.
// If the agent is still inside the 14-day cardless trial, the subscription
// inherits the remaining trial time (trial_end), so they aren't double-billed.
import { NextResponse } from 'next/server';
import { getCurrentAgent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, priceIdFor, appUrl, isTrialActive, PLANS, PlanId } from '@/lib/billing';


export async function POST(req: Request) {
  const agent = await getCurrentAgent();
  if (!agent) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });


  let plan: string;
  try {
    ({ plan } = await req.json());
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
    client_reference_id: agent.id,
    metadata: { agentId: agent.id, plan: planId },
    success_url: `${appUrl()}/dashboard?billing=success`,
    cancel_url: `${appUrl()}/#pricing`,
  });


  return NextResponse.json({ url: session.url });
}
