// components/TrustedSiteFloating.tsx
"use client";

import Script from "next/script";


const YOUR_DOMAIN = "express.wcss.com"; // ← replace with your real domain

export default function TrustedSiteFloating() {
  

  return (
    <Script
      id="trustedsite-floating"
      src="https://cdn.ywxi.net/js/1.js"
      strategy="afterInteractive"
      data-host={YOUR_DOMAIN}
    />
  );
}