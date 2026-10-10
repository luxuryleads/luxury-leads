'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } finally { setBusy(false); }
  }
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1>Forgot password</h1>
        {done ? (
          <>
            <p>If an account exists for <strong>{email}</strong>, a reset link is on its way. It expires in 1 hour.</p>
            <p className="auth-switch"><Link href="/login">Back to log in</Link></p>
          </>
        ) : (
          <>
            <p>Enter your account email and we&apos;ll send you a reset link.</p>
            <form onSubmit={submit}>
              <div className="field">
                <label className="field-label" htmlFor="email">Email</label>
                <input id="email" className="input" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <p className="auth-switch"><Link href="/login">Back to log in</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
