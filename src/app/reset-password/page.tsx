'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
function ResetForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed.');
    } finally { setBusy(false); }
  }
  if (!token) {
    return (
      <div className="card auth-card">
        <h1>Invalid link</h1>
        <p>This reset link is missing its token. Request a new one below.</p>
        <p className="auth-switch"><Link href="/forgot-password">Request reset link</Link></p>
      </div>
    );
  }
  return (
    <div className="card auth-card">
      <h1>Set a new password</h1>
      {done ? (
        <>
          <p>Done — your password has been updated.</p>
          <p className="auth-switch"><Link href="/login">Log in</Link></p>
        </>
      ) : (
        <form onSubmit={submit}>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <label className="field-label" htmlFor="np">New password (min 8 characters)</label>
            <input id="np" className="input" type="password" required minLength={8} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="npc">Confirm new password</label>
            <input id="npc" className="input" type="password" required value={confirm}
              onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      )}
    </div>
  );
}
export default function ResetPasswordPage() {
  return (
    <div className="auth-wrap">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
