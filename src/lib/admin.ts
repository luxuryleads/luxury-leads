// Admin gate for Sam's internal tools (comped partner accounts, etc.).
// The /admin page sends the secret with each request; it's checked here.
// Set ADMIN_SECRET in Vercel env vars. Never expose it client-side beyond
// the admin page's own requests.
import { timingSafeEqual } from 'crypto';

/** True when the provided secret matches ADMIN_SECRET. */
export function verifyAdminSecret(secret: unknown): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || typeof secret !== 'string' || secret.length === 0) return false;
  const a = Buffer.from(secret, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}
