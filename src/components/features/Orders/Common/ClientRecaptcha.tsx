// components/ClientRecaptcha.tsx
"use client";

import dynamic from "next/dynamic";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

export default ReCAPTCHA;
