'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewOpenHousePage() {
  const router = useRouter();
  const [form, setForm] = useState({ propertyAddress: '', propertyPrice: '', date: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/open-houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create open house.');
      router.push(`/dashboard/open-houses/${data.openHouse.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create open house.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-narrow" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <Link href="/dashboard" style={{ fontSize: 14 }}>← Back to dashboard</Link>
      <div className="card mt-2">
        <h1 style={{ margin: '0 0 6px', color: 'var(--navy)' }}>New open house</h1>
        <p className="hint" style={{ margin: '0 0 20px' }}>
          We’ll generate a QR code that points visitors to your sign-in form.
        </p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label className="field-label" htmlFor="addr">Property address</label>
            <input id="addr" className="input" required placeholder="123 Palm Court, Beverly Hills, CA"
              value={form.propertyAddress} onChange={set('propertyAddress')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="price">Listing price (optional)</label>
            <input id="price" className="input" placeholder="$2,450,000"
              value={form.propertyPrice} onChange={set('propertyPrice')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="date">Date (optional)</label>
            <input id="date" className="input" type="date"
              value={form.date} onChange={set('date')} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Creating…' : 'Create & get QR code'}
          </button>
        </form>
      </div>
    </div>
  );
}
