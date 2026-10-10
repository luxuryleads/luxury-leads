// ─────────────────────────────────────────────────────────────────────────────
//  EMAIL SERVICE — ★ RESEND STUB ★
// ─────────────────────────────────────────────────────────────────────────────
//  "Connect key to go live." Nothing in this module sends a real email until
//  RESEND_API_KEY is set in the environment. Until then every call is logged
//  and recorded as SKIPPED so sequences can be tested end-to-end safely.
//
//  To go live: create a key at https://resend.com, verify your sending
//  domain, set RESEND_API_KEY + RESEND_FROM_EMAIL in .env — no code changes.
// ─────────────────────────────────────────────────────────────────────────────

export interface MergeTagValues {
  first_name: string;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  brokerage: string;
  property_address: string;
  property_price: string;
}

/** Replace {{merge_tags}} in a template with real values. Unknown tags are left as-is. */
export function renderEmail(template: string, values: Partial<MergeTagValues>): string {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (match, key: string) => {
    const v = (values as Record<string, string | undefined>)[key];
    return v ?? match;
  });
}

/** Plain text → minimal HTML for email clients. */
export function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
  const paras = escaped.split(/\n{2,}/).map((p) => {
    const withBreaks = p.replace(/\n/g, '<br/>');
    return withBreaks.startsWith('- ') || withBreaks.includes('<br/>- ')
      ? `<ul>${withBreaks
          .split(/<br\/>/)
          .map((li) => `<li>${li.replace(/^- /, '')}</li>`)
          .join('')}</ul>`
      : `<p>${withBreaks}</p>`;
  });
  return paras.join('\n');
}

export interface SendResult {
  ok: boolean;
  skipped: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string; fromName?: string; replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddr = process.env.RESEND_FROM_EMAIL; const from = opts.fromName && fromAddr ? `${opts.fromName} <${fromAddr}>` : fromAddr; // Show the agent's name on the from line; replies go to the agent's inbox.

  // ── STUB: no key, no send. Safe to run locally and in CI. ──────────────────
  if (!apiKey || !from) {
    console.log(
      `[email-stub] NOT sending (RESEND_API_KEY not set). To: ${opts.to} | Subject: ${opts.subject}`
    );
    return { ok: false, skipped: true, error: 'RESEND_API_KEY not configured' };
  }

  // ── LIVE PATH: only reachable with a real key ─────────────────────────────
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: opts.to,
      subject: opts.subject,
      html: textToHtml(opts.text),
      text: opts.text, ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown error');
    return { ok: false, skipped: false, error: `Resend ${res.status}: ${errText}` };
  }
  const data = (await res.json()) as { id?: string };
  return { ok: true, skipped: false, messageId: data.id };
}
