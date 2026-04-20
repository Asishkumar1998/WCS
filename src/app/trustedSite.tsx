// components/TrustedSiteFloating.tsx
"use client";

import Script from "next/script";


const DOMAIN = "express.wcss.com"; 

export default function TrustedSiteFloating() {
  

  return (
    <Script
      id="trustedsite-floating"
      src="https://cdn.ywxi.net/js/1.js"
      strategy="afterInteractive"
      data-host={DOMAIN}
    />
  );
}