'use client';
import { useState } from 'react';
export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setError('');
    if (newPassword !== confirm) { setError('New passwords do not match.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password.');
      setMsg('Password changed.');
      setCurrentPassword(''); setNewPassword(''); setConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
      <div className="field">
        <label className="field-label" htmlFor="cp-current">Current password</label>
        <input id="cp-current" className="input" type="password" required value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="cp-new">New password (min 8 characters)</label>
        <input id="cp-new" className="input" type="password" required minLength={8} value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="cp-confirm">Confirm new password</label>
        <input id="cp-confirm" className="input" type="password" required value={confirm}
          onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      </div>
      <button className="btn btn-secondary" disabled={busy}>
        {busy ? 'Saving…' : 'Change password'}
      </button>
    </form>
  );
}
