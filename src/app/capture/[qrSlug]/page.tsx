import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CaptureForm } from '@/components/CaptureForm';

export default async function CapturePage({ params }: { params: { qrSlug: string } }) {
  const openHouse = await prisma.openHouse.findUnique({
    where: { qrSlug: params.qrSlug },
    include: { agent: { select: { name: true, brokerage: true } } },
  });

  if (!openHouse) {
    return (
      <div className="capture-wrap">
        <div className="card capture-card thankyou">
          <h2>This sign-in link isn’t active</h2>
          <p>The open house may have ended or the QR code may be outdated. Please check with the hosting agent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="capture-wrap">
      <CaptureForm qrSlug={openHouse.qrSlug} propertyAddress={openHouse.propertyAddress} />
    </div>
  );
}
