// One-click unsubscribe links for drip emails.
// Stateless: the token is the lead id signed with an HMAC (server secret),
// so no database migration is needed. processDueSequences already skips
// leads with unsubscribed=true.
import { createHmac, timingSafeEqual } from 'crypto';

function signingSecret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error('Set UNSUBSCRIBE_SECRET or NEXTAUTH_SECRET');
  return s;
}

/** Build a one-click unsubscribe token for a lead id. */
export function signUnsubscribeToken(leadId: string): string {
  const sig = createHmac('sha256', signingSecret()).update(leadId).digest('hex');
  return `${leadId}.${sig}`;
}

/** Returns the lead id when the token is valid, otherwise null. */
export function verifyUnsubscribeToken(token: string): string | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;
  const leadId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', signingSecret()).update(leadId).digest('hex');
  if (sig.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))
    ? leadId
    : null;
}

/** Absolute one-click unsubscribe URL for a lead. */
export function unsubscribeUrl(leadId: string): string {
  const base = (process.env.APP_URL ?? 'https://getluxuryleads.com').replace(/\/+$/, '');
  return `${base}/api/unsubscribe?token=${encodeURIComponent(signUnsubscribeToken(leadId))}`;
}
