"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { getCustomerId } from "@/services/userService";
import { loginWithHandoffCode } from "@/app/utils/authSerivce";
import { LEGACY_PORTAL_LOGIN_URL } from "@/constants/api";

function SSOContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code") || "";
      if (!code) {
        setMessage("Invalid sign-in link. Please login again.");
        setTimeout(() => {
          window.location.href = LEGACY_PORTAL_LOGIN_URL;
        }, 1200);
        return;
      }

      try {
        const auth = await loginWithHandoffCode(code);
        const customerId = await getCustomerId(String(auth.userId));
        const updatedAuth = { ...auth, customerId };
        sessionStorage.setItem("auth", JSON.stringify(updatedAuth));
        router.replace("/");
      } catch {
        setMessage("Unable to complete sign-in. Please login again.");
        setTimeout(() => {
          window.location.href = LEGACY_PORTAL_LOGIN_URL;
        }, 1200);
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default function SSOPage() {
  return (
    <Suspense fallback={<SSOFallback />}>
      <SSOContent />
    </Suspense>
  );
}

function SSOFallback() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Signing you in...
      </Typography>
    </Box>
  );
}
