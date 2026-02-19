"use client";

import { Done } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Link, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ThankyouPage = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, router]);

  //   useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/login");
  //   }, 15000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          url("/world-map.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          px: 6,
          py: 2,
          color: "#fff",
          gap: 3,
        }}
      >
        {/* LOGO */}
        <Image
          src="/WCS-Express-Logo.png"
          alt="WCS Logo"
          width={190}
          height={160}
        />

        {/* TITLE + ADDRESS COLUMN */}
        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight={600}
            lineHeight={1.2}
            sx={{
              fontFamily: "'Lato', sans-serif !important",
              fontSize: "35px",
              marginBottom: "4px",
            }}
            color="white"
          >
            Washington Consular Services
          </Typography>

          {/* Address (touches title start) */}
          <Box
            sx={{
              borderTop: "4px solid #c7022e",
              paddingTop: "7px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                color: "white",
                fontSize: "16.5px",
                fontWeight: "500",
              }}
            >
              20 Courthouse Square, Suite 219, Rockville, Maryland, 20850 USA
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                color: "white",
                fontSize: "16.5px",
                fontWeight: "500",
              }}
            >
              Email: wcs@wcss.com &nbsp; | &nbsp; Phone: +1 301 605 1500
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                color: "white",
                fontSize: "16.5px",
                fontWeight: "500",
              }}
            >
              Toll Free: 1-866-ALL-DOCS (255-3627)
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          height: "50vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "40px",
            width: "500px",
            backgroundColor: "transparent",
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            position: "absolute",
            top: "26%",
            padding: "10px",
          }}
        >
          {/* Countdown timer */}
          <Typography sx={{ fontSize: "16px", mt: 1 }}>
           Redirecting to login in {seconds} seconds...
          </Typography>

          {/* Back button */}
          <Link
            href={"/login"}
            sx={{ color: "#fff", padding: "0px", marginTop: "10px" }}
          >
            <CloseIcon sx={{ fontSize: "25px" }} />
          </Link>
        </Box>
        <Box
          sx={{
            height: "170px",
            width: "500px",
            backgroundColor: "#c8002e",
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            gap: 1,
            borderRadius: "5px",
            boxShadow: "0px 0px 12px black",
          }}
        >
          <Box p={3} ml={0}>
            <Done sx={{ fontSize: "50px", fontWeight: "900px", color:"#34a853"}} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "20px",
              }}
            >
              Thank you for signing up with WCS. <br />
              You will be notified once approved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ThankyouPage;
