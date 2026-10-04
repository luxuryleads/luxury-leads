'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/** Renders a QR code pointing at the public capture URL, generated in-browser. */
export function CaptureQR({ qrSlug, size = 220 }: { qrSlug: string; size?: number }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Built client-side so it works on any domain without config.
    setUrl(`${window.location.origin}/capture/${qrSlug}`);
  }, [qrSlug]);

  if (!url) return <div style={{ width: size, height: size }} className="qr-loading" />;

  return (
    <div className="qr-wrap">
      <QRCodeSVG value={url} size={size} level="M" />
      <p className="qr-url">{url}</p>
    </div>
  );
}
