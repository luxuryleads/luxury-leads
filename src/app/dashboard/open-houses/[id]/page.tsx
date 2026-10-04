import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentAgent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TIMELINE_LABELS } from '@/lib/scoring';
import { ScoreBadge } from '@/components/ScoreBadge';
import { CaptureQR } from '@/components/QRCode';

export default async function OpenHouseDetailPage({ params }: { params: { id: string } }) {
  const agent = await getCurrentAgent();
  if (!agent) redirect('/login');

  const oh = await prisma.openHouse.findFirst({
    where: { id: params.id, agentId: agent.id },
    include: { leads: { orderBy: { createdAt: 'desc' } } },
  });
  if (!oh) notFound();

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 48 }}>
      <Link href="/dashboard" style={{ fontSize: 14 }}>← Back to dashboard</Link>

      <div className="two-col mt-2">
        <div>
          <div className="card">
            <h1 style={{ margin: '0 0 4px', color: 'var(--navy)' }}>{oh.propertyAddress}</h1>
            <p className="hint" style={{ margin: '0 0 20px' }}>
              {oh.propertyPrice ?? 'Price TBD'}
              {oh.date ? ` · ${new Date(oh.date).toLocaleDateString()}` : ''}
            </p>
            <CaptureQR qrSlug={oh.qrSlug} size={240} />
            <p className="hint mt-2">
              Print this QR code and place it at the entrance. Visitors scan it to sign in.
            </p>
          </div>
        </div>

        <div>
          <h2 style={{ color: 'var(--navy)', marginTop: 0 }}>
            Leads ({oh.leads.length})
          </h2>
          {oh.leads.length === 0 ? (
            <div className="card"><p>No sign-ins yet.</p></div>
          ) : (
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="lead-table">
                <thead>
                  <tr><th>Name</th><th>Contact</th><th>Score</th><th>Timeline</th></tr>
                </thead>
                <tbody>
                  {oh.leads.map((l) => (
                    <tr key={l.id}>
                      <td><strong>{l.firstName} {l.lastName ?? ''}</strong></td>
                      <td>{l.email ?? l.phone ?? '—'}</td>
                      <td><ScoreBadge score={l.score} /></td>
                      <td>{TIMELINE_LABELS[l.timeline as keyof typeof TIMELINE_LABELS] ?? l.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
