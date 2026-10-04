import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentAgent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TIMELINE_LABELS } from '@/lib/scoring';
import { ScoreBadge } from '@/components/ScoreBadge';
import { EmbedSnippet } from '@/components/EmbedSnippet';
import { LogoutButton } from '@/components/LogoutButton';

export default async function DashboardPage() {
  const agent = await getCurrentAgent();
  if (!agent) redirect('/login');

  const openHouses = await prisma.openHouse.findMany({
    where: { agentId: agent.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { leads: true } } },
  });

  const leads = await prisma.lead.findMany({
    where: { openHouse: { agentId: agent.id } },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { openHouse: { select: { propertyAddress: true } } },
  });

  const counts = {
    total: leads.length,
    hot: leads.filter((l) => l.score === 'HOT').length,
    warm: leads.filter((l) => l.score === 'WARM').length,
    cold: leads.filter((l) => l.score === 'COLD').length,
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/dashboard" className="brand">
            Luxury<span>Leads</span>
          </Link>
          <div className="nav-links">
            <span style={{ color: '#dbe3f0', fontSize: 14 }}>{agent.name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="dash-head">
          <h1>Dashboard</h1>
          <Link href="/dashboard/open-houses/new" className="btn btn-primary">
            + New open house
          </Link>
        </div>

        <div className="stats">
          <div className="card stat"><div className="stat-num">{counts.total}</div><div className="stat-label">Total leads</div></div>
          <div className="card stat"><div className="stat-num" style={{ color: 'var(--hot)' }}>{counts.hot}</div><div className="stat-label">Hot</div></div>
          <div className="card stat"><div className="stat-num" style={{ color: 'var(--warm)' }}>{counts.warm}</div><div className="stat-label">Warm</div></div>
          <div className="card stat"><div className="stat-num" style={{ color: 'var(--cold)' }}>{counts.cold}</div><div className="stat-label">Cold</div></div>
        </div>

        <h2 style={{ color: 'var(--navy)' }}>Open houses</h2>
        {openHouses.length === 0 ? (
          <div className="card">
            <p>No open houses yet. Create your first one to get a QR code.</p>
            <Link href="/dashboard/open-houses/new" className="btn btn-secondary">Create open house</Link>
          </div>
        ) : (
          <div className="oh-grid">
            {openHouses.map((oh) => (
              <div key={oh.id} className="card oh-card">
                <h3>{oh.propertyAddress}</h3>
                <p className="meta">
                  {oh.propertyPrice ?? 'Price TBD'}
                  {oh.date ? ` · ${new Date(oh.date).toLocaleDateString()}` : ''} ·{' '}
                  {oh._count.leads} lead{oh._count.leads === 1 ? '' : 's'}
                </p>
                <div className="oh-actions">
                  <Link href={`/dashboard/open-houses/${oh.id}`} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 14 }}>
                    View & QR code
                  </Link>
                  <Link href={`/capture/${oh.qrSlug}`} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 14, color: 'var(--navy)', borderColor: 'var(--line)' }}>
                    Open form
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="mt-4" style={{ color: 'var(--navy)' }}>Latest leads</h2>
        {leads.length === 0 ? (
          <div className="card"><p>No leads yet — share your QR code at your next open house.</p></div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="lead-table">
              <thead>
                <tr><th>Name</th><th>Contact</th><th>Property</th><th>Score</th><th>Timeline</th><th>Captured</th></tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td><strong>{l.firstName} {l.lastName ?? ''}</strong></td>
                    <td>{l.email ?? l.phone ?? '—'}</td>
                    <td>{l.openHouse.propertyAddress}</td>
                    <td><ScoreBadge score={l.score} /></td>
                    <td>{TIMELINE_LABELS[l.timeline as keyof typeof TIMELINE_LABELS] ?? l.timeline}</td>
                    <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="mt-4" style={{ color: 'var(--navy)' }}>Website widget</h2>
        <div className="card">
          <p className="hint" style={{ marginTop: 0 }}>
            Paste this snippet on your own website to capture leads there too — same
            scoring and follow-up as the QR form.
          </p>
          <EmbedSnippet agentId={agent.id} />
        </div>
        <div style={{ height: 48 }} />
      </div>
    </>
  );
}
