// components/TrustedSiteCertified.tsx
"use client";

import Script from "next/script";


export default function TrustedSiteCertified() {
  return (
    <>
      <Script
        id="trustedsite-inline-72"
        src="https://cdn.ywxi.net/js/inline.js?w=72"
        strategy="afterInteractive"
        
      />

      {/* Script 3: Inline badge type 103 */}
      <Script
        id="trustedsite-inline-t103"
        src="https://cdn.ywxi.net/js/inline.js?t=103"
        strategy="afterInteractive"
      />

      {/* Script 4: Inline badge 90px wide */}
      <Script
        id="trustedsite-inline-90"
        src="https://cdn.ywxi.net/js/inline.js?w=90"
        strategy="afterInteractive"
      />
    </>
  );
}
