"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { Box } from "@mui/material";

export default function GoDaddySeal() {
  const pathname = usePathname();

 

  return (
    <>
      <Script
        src="https://seal.godaddy.com/getSeal?sealID=DXP8dPL4iK9BQhiIblVRlrORv2iWSDAA1l11hG2wU6h4gQskGKKSgB58Fcm7"
        strategy="afterInteractive"
      />
      <span id="siteseal" className="godaddy-seal-position" />
    </>
  );
}