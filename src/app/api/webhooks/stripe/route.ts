// POST /api/webhooks/stripe
// Stripe webhook receiver. Verifies the signature, then syncs the agent's
// plan + subscription status. Keep this fast and idempotent — Stripe retries
// events, so every handler must be safe to run twice.
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getStripe, planForPriceId } from '@/lib/billing';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const agentId = session.metadata?.agentId || session.client_reference_id;
        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : null;
        if (agentId && subscriptionId) {
          const stripe = getStripe();
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const plan =
            session.metadata?.plan || planForPriceId(sub.items.data[0]?.price.id ?? '');
          const data: Record<string, unknown> = {
            stripeCustomerId:
              typeof session.customer === 'string' ? session.customer : undefined,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: sub.status,
            trialEndsAt: null, // Stripe now owns the trial/billing clock
          };
          if (plan) data.plan = plan;
          await prisma.agent.update({ where: { id: agentId }, data });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id;
        const plan = planForPriceId(priceId ?? '');
        const data: Record<string, unknown> = { subscriptionStatus: sub.status };
        if (plan) data.plan = plan;
        // Find the agent by subscription id first, then by customer id.
        const agent =
          (sub.id &&
            (await prisma.agent.findFirst({ where: { stripeSubscriptionId: sub.id } }))) ||
          (typeof sub.customer === 'string'
            ? await prisma.agent.findFirst({ where: { stripeCustomerId: sub.customer } })
            : null);
        if (agent) {
          await prisma.agent.update({ where: { id: agent.id }, data });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const agent =
          (sub.id &&
            (await prisma.agent.findFirst({ where: { stripeSubscriptionId: sub.id } }))) ||
          (typeof sub.customer === 'string'
            ? await prisma.agent.findFirst({ where: { stripeCustomerId: sub.customer } })
            : null);
        if (agent && agent.plan !== 'comped') {
          await prisma.agent.update({
            where: { id: agent.id },
            data: { subscriptionStatus: 'canceled', stripeSubscriptionId: null },
          });
        }
        break;
      }

      default:
        break; // ignore everything else
    }
  } catch (err) {
    console.error('Stripe webhook handler failed:', event.type, err);
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
