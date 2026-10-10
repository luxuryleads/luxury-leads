// Stateless password-reset tokens: agentId.expiry.HMAC, no DB migration needed.
// Tokens expire after 1 hour. Signed with NEXTAUTH_SECRET.
import { createHmac, timingSafeEqual } from 'crypto';

const EXPIRY_MS = 60 * 60 * 1000;

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error('NEXTAUTH_SECRET is not set');
  return s;
}

export function createPasswordResetToken(agentId: string): string {
  const expires = Date.now() + EXPIRY_MS;
  const payload = `${agentId}.${expires}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

/** Returns the agent id when the token is valid and unexpired, otherwise null. */
export function verifyPasswordResetToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [agentId, expiresStr, sig] = parts;
  const payload = `${agentId}.${expiresStr}`;
  const expected = createHmac('sha256', secret()).update(payload).digest('hex');
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))) return null;
  if (Number(expiresStr) < Date.now()) return null;
  return agentId;
}

export function passwordResetUrl(agentId: string): string {
  const base = (process.env.APP_URL ?? 'https://getluxuryleads.com').replace(/\/+$/, '');
  return `${base}/reset-password?token=${encodeURIComponent(createPasswordResetToken(agentId))}`;
}
