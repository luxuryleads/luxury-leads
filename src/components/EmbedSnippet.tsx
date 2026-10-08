'use client';

import { useState } from 'react';

/**
 * Copy-paste embed snippet agents put on their own websites.
 * It drops in an iframe pointing at the public widget route.
 * The base URL is always this app's own URL — the agent just copies.
 */
export function EmbedSnippet({ agentId, baseUrl = 'https://getluxuryleads.com' }: { agentId: string; baseUrl?: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `<!-- Luxury Leads capture widget — paste anywhere on your site -->\n<iframe\n  src="${baseUrl}/widget/${agentId}"\n  width="100%"\n  height="560"\n  style="border:0;border-radius:12px;max-width:420px;"\n  title="Luxury Leads sign-in"\n></iframe>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      // Clipboard API unavailable (older browsers) — select fallback.
      const ta = document.createElement('textarea');
      ta.value = snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="embed-snippet">
      <pre className="code-block">{snippet}</pre>
      <button className="btn btn-secondary" onClick={copy}>
        {copied ? 'Copied!' : 'Copy embed code'}
      </button>
      <p className="hint">
        Paste the code above anywhere on your website and the sign-in form appears
        there. The widget shows your most recent open house. Pass{' '}
        <code>?openHouse=QR_SLUG</code> in the iframe URL to pin a specific one.
      </p>
    </div>
  );
}
