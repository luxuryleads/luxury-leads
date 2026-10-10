import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Luxury Leads — Never lose another open-house lead',
  description:
    'Luxury Leads turns open-house visitors into scored, followed-up leads. QR sign-in, automatic hot / warm / cold scoring, and built-in email drip sequences — from $19/mo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const rewardfulKey = process.env.NEXT_PUBLIC_REWARDFUL_API_KEY;
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable}`}>
        {rewardfulKey && (
          <>
            <Script id="rewardful-queue" strategy="beforeInteractive">
              {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}
            </Script>
            <Script
              id="rewardful-js"
              src="https://r.wdfl.co/rw.js"
              data-rewardful={rewardfulKey}
              strategy="afterInteractive"
            />
          </>
        )}
        {children}
      </body>
    </html>
  );
}
