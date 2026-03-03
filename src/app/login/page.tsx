"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  InputAdornment,
  Link,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginUser } from "../utils/authSerivce";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { forgotPassword, getCustomerId } from "@/services/userService";
import ReCAPTCHA from "@/components/features/Orders/Common/ClientRecaptcha";

const CustomerLogin = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const handleSubmit = async () => {
    if (!captchaValid) {
      showSnackbar("Please verify captcha", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      if (res?.authToken) {
        const customerId = await getCustomerId(res.userId);
        const updatedAuth = {
          ...res,
          customerId,
        };
        sessionStorage.setItem("auth", JSON.stringify(updatedAuth));
        router.push("/");
      } else {
        throw new Error();
      }
    } catch {
      showSnackbar("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgotPassword = () => {
    setForgotPasswordEmail(form.email || "");
    setForgotPasswordOpen(true);
  };

  const handleForgotPassword = async () => {
    const email = forgotPasswordEmail.trim();
    if (!email) {
      showSnackbar("Please provide email.", "warning");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response?.status === "success") {
        showSnackbar(
          `We have sent mail to ${email} along with the one time credentials. Request you to check your mail.`,
          "success"
        );
      } else {
        showSnackbar(response?.err || "Unable to process request.", "error");
      }
      setForgotPasswordOpen(false);
    } catch {
      showSnackbar("Unable to process request.", "error");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

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
        alignItems: "center",
        position: "relative",
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
          mt: 3,
        }}
      >
        {/* LOGO */}
        <Image
          src="/WCS-Express-Logo.png"
          alt="WCS Logo"
          width={130}
          height={130}
          style={{ width: "11.875rem", height: "10rem" }}
        />

        {/* TITLE + ADDRESS COLUMN */}
        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Typography
            variant="h4"
            fontWeight={600}
            lineHeight={1.2}
            fontSize={"42px"}
            sx={{
              fontFamily: "'Lato', sans-serif !important",
            }}
            color="white"
          >
            Washington Consular Services
          </Typography>

          {/* Red underline (auto width) */}
          <Box
            sx={{
              height: 3,
              width: "100%",
              maxWidth: 520,
              backgroundColor: "#c8102e",
              mt: 0.5,
            }}
          />

          {/* Address (touches title start) */}
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                color: "white",
                fontSize: "1.2375rem",
                fontWeight: 500,
              }}
            >
              20 Courthouse Square, Suite 219, Rockville, Maryland, 20850 USA
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                color: "white",
                fontSize: "1.2375rem",
                fontWeight: 500,
              }}
            >
              Email: wcs@wcss.com &nbsp; | &nbsp; Phone: +1 301 605 1500
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                color: "white",
                fontSize: "1.2375rem",
                fontWeight: 500,
              }}
            >
              Toll Free: 1-866-ALL-DOCS (255-3627)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Login Card */}
      <Box
        sx={{
          width: 620,
          p: 4,
          borderRadius: 3,

          background:
            "linear-gradient(135deg, rgba(15,35,65,0.85), rgba(10,25,50,0.75))",

          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          // Border
          border: "1px solid rgba(255,255,255,0.25)",

          // Glow + depth
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.1) inset,
            0 8px 32px rgba(0,0,0,0.6),
            0 0 40px rgba(255,255,255,0.35)
          `,
          mt: 5,
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight={500}
          color="#fff"
          mb={6}
          fontSize={"2.1rem"}
        >
          Sign In to WCS Express
        </Typography>

        <FormControl fullWidth>
          <OutlinedInput
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& fieldset": { border: "none" },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <OutlinedInput
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            sx={{
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& fieldset": { border: "none" },
            }}
          />
        </FormControl>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 2,
          }}
        >
          <ReCAPTCHA
            sitekey="6LeElDUsAAAAAPMaM1facZ4cNKil_cdBznsf3wmj"
            onChange={(val) => setCaptchaValid(!!val)}
          />
        </Box>

        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            height: 48,
            backgroundColor: "#c8102e",
            color: "#fff",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#a50d25" },
            "&.Mui-disabled": {
              backgroundColor: "#c8102e",
              opacity: 0.7,
              color: "#fff",
            },
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Typography variant="body2" color="#fff" fontWeight={600}>
            New to WCS?{" "}
            
              <Link
                href="/signup" underline="none"
                sx={{color: "red", ml: 1}}
                
              >Sign Up Now</Link>
              
            
          </Typography>

          <Typography
            variant="body2"
            color="#fff"
            sx={{ cursor: "pointer", fontWeight: 600 }}
            onClick={handleOpenForgotPassword}
          >
            Forgot password?
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={forgotPasswordOpen}
        onClose={() => !forgotPasswordLoading && setForgotPasswordOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <InputLabel sx={{ mb: 1, mt: 1 }}>Email Address</InputLabel>
          <OutlinedInput
            fullWidth
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            placeholder="Email Address"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setForgotPasswordOpen(false)}
            disabled={forgotPasswordLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleForgotPassword}
            disabled={forgotPasswordLoading}
            sx={{
              backgroundColor: "#c8102e",
              "&:hover": { backgroundColor: "#a50d25" },
            }}
          >
            {forgotPasswordLoading ? "Processing..." : "Forgot Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Branding */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#fff",
        }}
      >
        <Image src="/logo-wcs.png" alt="WCS" width={60} height={45} />
        <Typography variant="body2">Powered by WCS</Typography>
      </Box>
    </Box>
  );
};

export default CustomerLogin;
