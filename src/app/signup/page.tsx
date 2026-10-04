'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', brokerage: '', phone: '' });
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed.');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1>Create your account</h1>
        <p>Start capturing leads at your next open house.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label className="field-label" htmlFor="name">Full name</label>
            <input id="name" className="input" required value={form.name} onChange={set('name')} autoComplete="name" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Password (min 8 characters)</label>
            <input id="password" className="input" type="password" required minLength={8} value={form.password} onChange={set('password')} autoComplete="new-password" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="brokerage">Brokerage (optional)</label>
            <input id="brokerage" className="input" value={form.brokerage} onChange={set('brokerage')} autoComplete="organization" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="phone">Phone (optional — appears in your follow-up emails)</label>
            <input id="phone" className="input" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
