// Stripe billing for Luxury Leads.
//
// Flow: 14-day cardless free trial (tracked in our DB via Agent.trialEndsAt).
// When the agent picks a plan, we send them to Stripe Checkout; the webhook
// keeps Agent.plan / subscriptionStatus in sync. Access = active/trialing
// subscription OR unexpired trial OR comped partner account.
import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/** Lazily initialized so builds don't crash when the key isn't set yet. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set.');
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export type PlanId = 'starter' | 'pro' | 'team';

export const PLANS: Record<PlanId, { name: string; priceIdEnv: string }> = {
  starter: { name: 'Starter', priceIdEnv: 'STRIPE_PRICE_STARTER' },
  pro: { name: 'Pro', priceIdEnv: 'STRIPE_PRICE_PRO' },
  team: { name: 'Team', priceIdEnv: 'STRIPE_PRICE_TEAM' },
};

export function priceIdFor(plan: PlanId): string {
  const id = process.env[PLANS[plan].priceIdEnv];
  if (!id) throw new Error(`${PLANS[plan].priceIdEnv} is not set.`);
  return id;
}

/** Reverse lookup: Stripe Price ID -> our plan id. */
export function planForPriceId(priceId: string): PlanId | null {
  for (const plan of Object.keys(PLANS) as PlanId[]) {
    if (process.env[PLANS[plan].priceIdEnv] === priceId) return plan;
  }
  return null;
}

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing']);

export function isSubscriptionActive(status: string | null | undefined): boolean {
  return !!status && ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

export function isTrialActive(trialEndsAt: Date | null | undefined): boolean {
  return !!trialEndsAt && trialEndsAt.getTime() > Date.now();
}

type BillableAgent = {
  plan: string;
  trialEndsAt: Date | null;
  subscriptionStatus: string | null;
};

/** Can this agent use the dashboard? Comped partners always can. */
export function hasActiveAccess(agent: BillableAgent): boolean {
  if (agent.plan === 'comped') return true;
  if (isSubscriptionActive(agent.subscriptionStatus)) return true;
  return isTrialActive(agent.trialEndsAt);
}

/** Whole days left in the cardless trial (0 when expired or n/a). */
export function trialDaysLeft(agent: BillableAgent): number {
  if (!agent.trialEndsAt) return 0;
  const ms = agent.trialEndsAt.getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (24 * 3600 * 1000)) : 0;
}

export function planLabel(agent: BillableAgent): string {
  if (agent.plan === 'comped') return 'Partner (free)';
  if (agent.plan === 'trial') return 'Free trial';
  return PLANS[agent.plan as PlanId]?.name ?? agent.plan;
}

export function appUrl(): string {
  return (process.env.APP_URL || 'https://getluxuryleads.com').replace(/\/$/, '');
}
