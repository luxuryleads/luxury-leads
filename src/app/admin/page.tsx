'use client';
// Sam's internal admin page (not linked anywhere — visit /admin directly).
// Unlock with the admin password once per tab; it stays in sessionStorage.
import { useState } from 'react';
export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [createMsg, setCreateMsg] = useState('');
  const [createError, setCreateError] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compMsg, setCompMsg] = useState('');
  const [compError, setCompError] = useState('');
  const [busy, setBusy] = useState(false);
  function getSecret() { return sessionStorage.getItem('ll_admin') ?? ''; }
  function unlock(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    if (!secret) { setAuthError('Enter the admin password.'); return; }
    sessionStorage.setItem('ll_admin', secret);
    setUnlocked(true);
  }
  function handleUnauthorized() {
    sessionStorage.removeItem('ll_admin');
    setUnlocked(false);
    setSecret('');
    setAuthError('Wrong password — try again.');
  }
  async function createComped(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg(''); setCreateError(''); setBusy(true);
    try {
      const res = await fetch('/api/admin/create-comped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: getSecret(), name, email, password: tempPassword }),
      });
      const data = await res.json();
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error(data.error || 'Failed.');
      setCreateMsg(`Free account created for ${data.agent.name} (${data.agent.email}). Share the temporary password with them — they'll change it from their dashboard.`);
      setName(''); setEmail(''); setTempPassword('');
    } catch (err) { setCreateError(err instanceof Error ? err.message : 'Failed.'); }
    finally { setBusy(false); }
  }
  async function compExisting(e: React.FormEvent) {
    e.preventDefault();
    setCompMsg(''); setCompError(''); setBusy(true);
    try {
      const res = await fetch('/api/admin/comp-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: getSecret(), email: compEmail }),
      });
      const data = await res.json();
      if (res.status === 401) return handleUnauthorized();
      if (!res.ok) throw new Error(data.error || 'Failed.');
      setCompMsg(`${data.agent.name} (${data.agent.email}) is now on the free partner plan.`);
      setCompEmail('');
    } catch (err) { setCompError(err instanceof Error ? err.message : 'Failed.'); }
    finally { setBusy(false); }
  }
  if (!unlocked) {
    return (
      <div className="auth-wrap">
        <div className="card auth-card">
          <h1>Admin</h1>
          <p>Internal tools. Enter the admin password to continue.</p>
          {authError && <div className="error">{authError}</div>}
          <form onSubmit={unlock}>
            <div className="field">
              <label className="field-label" htmlFor="admin-secret">Admin password</label>
              <input id="admin-secret" className="input" type="password" required value={secret}
                onChange={(e) => setSecret(e.target.value)} autoComplete="off" />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Unlock</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="container" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 48 }}>
      <h1 style={{ color: 'var(--navy)' }}>Admin — partner accounts</h1>
      <p className="hint">Free partner accounts never pay and never expire. They log in at /login like everyone else.</p>
      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0, color: 'var(--navy)' }}>Create free account</h2>
        <p className="hint" style={{ marginTop: 0 }}>For a partner who doesn&apos;t have an account yet. Give them the temporary password yourself — they&apos;ll change it from their dashboard.</p>
        {createMsg && <div className="success">{createMsg}</div>}
        {createError && <div className="error">{createError}</div>}
        <form onSubmit={createComped}>
          <div className="field">
            <label className="field-label" htmlFor="c-name">Name</label>
            <input id="c-name" className="input" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="c-email">Email</label>
            <input id="c-email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="c-pass">Temporary password (min 8 characters)</label>
            <input id="c-pass" className="input" type="text" required minLength={8} value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} autoComplete="off" />
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Create free account'}</button>
        </form>
      </div>
      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0, color: 'var(--navy)' }}>Comp an existing account</h2>
        <p className="hint" style={{ marginTop: 0 }}>For someone who already signed up. Flips them to the free partner plan — trial and billing are cleared.</p>
        {compMsg && <div className="success">{compMsg}</div>}
        {compError && <div className="error">{compError}</div>}
        <form onSubmit={compExisting}>
          <div className="field">
            <label className="field-label" htmlFor="e-email">Account email</label>
            <input id="e-email" className="input" type="email" required value={compEmail} onChange={(e) => setCompEmail(e.target.value)} autoComplete="off" />
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Working…' : 'Make it free'}</button>
        </form>
      </div>
    </div>
  );
}
