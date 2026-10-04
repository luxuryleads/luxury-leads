import { prisma } from '@/lib/prisma';
import { CaptureForm } from '@/components/CaptureForm';

/**
 * Embeddable widget — designed to live inside an <iframe> on an agent's own site.
 * Shows the agent's most recent open house, or ?openHouse=QR_SLUG to pin one.
 */
export default async function WidgetPage({
  params,
  searchParams,
}: {
  params: { agentId: string };
  searchParams: { openHouse?: string };
}) {
  const agent = await prisma.agent.findUnique({ where: { id: params.agentId } });

  if (!agent) {
    return (
      <div className="widget-wrap">
        <p className="hint">Widget unavailable — unknown agent.</p>
      </div>
    );
  }

  let openHouse = null;
  if (searchParams.openHouse) {
    openHouse = await prisma.openHouse.findFirst({
      where: { qrSlug: searchParams.openHouse, agentId: agent.id },
    });
  }
  if (!openHouse) {
    openHouse = await prisma.openHouse.findFirst({
      where: { agentId: agent.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (!openHouse) {
    return (
      <div className="widget-wrap">
        <p className="hint">{agent.name} has no open houses yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="widget-wrap">
      <CaptureForm qrSlug={openHouse.qrSlug} propertyAddress={openHouse.propertyAddress} compact />
    </div>
  );
}
