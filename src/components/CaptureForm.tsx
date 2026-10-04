'use client';

import { useState } from 'react';
import { TIMELINE_LABELS, type TimelineAnswer } from '@/lib/scoring';

const TIMELINES: TimelineAnswer[] = ['lt_30_days', 'two_six_months', 'gt_6_months', 'browsing'];

interface Props {
  qrSlug: string;
  propertyAddress: string;
  compact?: boolean;
}

/** Public sign-in form — used by /capture/[qrSlug] and the embeddable widget. */
export function CaptureForm({ qrSlug, propertyAddress, compact }: Props) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timeline: 'lt_30_days' as TimelineAnswer,
    preApproved: false,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function set(key: 'firstName' | 'lastName' | 'email' | 'phone') {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrSlug, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card capture-card thankyou">
        <h2>Thanks, {form.firstName}! 🎉</h2>
        <p>You’re signed in. The agent will be in touch shortly — enjoy the tour!</p>
      </div>
    );
  }

  return (
    <div className="card capture-card">
      {!compact && (
        <>
          <h1>Welcome! 👋</h1>
          <p className="addr">Sign in to tour {propertyAddress}</p>
        </>
      )}
      {compact && <h1 style={{ fontSize: 20 }}>Interested in {propertyAddress}?</h1>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label className="field-label" htmlFor="fn">First name</label>
          <input id="fn" className="input" required value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="ln">Last name</label>
          <input id="ln" className="input" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="em">Email</label>
          <input id="em" className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="ph">Phone</label>
          <input id="ph" className="input" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="tl">When are you looking to buy?</label>
          <select id="tl" className="input" value={form.timeline}
            onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value as TimelineAnswer }))}>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{TIMELINE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <span className="field-label">Are you pre-approved for a mortgage?</span>
          <div className="radio-row">
            <label className="radio-pill">
              <input type="radio" name="pre" checked={form.preApproved === true}
                onChange={() => setForm((f) => ({ ...f, preApproved: true }))} />
              <span>Yes</span>
            </label>
            <label className="radio-pill">
              <input type="radio" name="pre" checked={form.preApproved === false}
                onChange={() => setForm((f) => ({ ...f, preApproved: false }))} />
              <span>Not yet</span>
            </label>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="hint mt-2" style={{ textAlign: 'center' }}>
          By signing in you agree to be contacted about this property.
        </p>
      </form>
    </div>
  );
}
