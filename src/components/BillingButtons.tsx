'use client';

import { useState } from 'react';

async function postAndRedirect(url: string, body: object, setError: (m: string) => void, setBusy: (b: boolean) => void) {
  setError('');
  setBusy(true);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    if (data.url) window.location.href = data.url;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong.');
    setBusy(false);
  }
}

export function CheckoutButton({
  plan,
  label,
  className = 'btn btn-primary',
}: {
  plan: 'starter' | 'pro' | 'team';
  label: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <button
        className={className}
        disabled={busy}
        onClick={() => {
          // Rewardful affiliate referral, if the visitor arrived via a partner link.
          const referral =
            typeof window !== 'undefined' ? window.Rewardful?.referral : undefined;
          postAndRedirect(
            '/api/billing/checkout',
            { plan, ...(referral ? { referral } : {}) },
            setError,
            setBusy
          );
        }}
      >
        {busy ? 'Loading…' : label}
      </button>
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}

export function ManageBillingButton({ className = 'btn btn-secondary' }: { className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <button
        className={className}
        disabled={busy}
        onClick={() => postAndRedirect('/api/billing/portal', {}, setError, setBusy)}
      >
        {busy ? 'Loading…' : 'Manage billing'}
      </button>
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
