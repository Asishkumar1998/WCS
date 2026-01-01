"use client";

import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/services/userService";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";

/* --------------------------------
   Utils (Angular services equivalent)
---------------------------------- */

const getUserId = () => {
  const auth = sessionStorage.getItem("auth");
  if (!auth) return null;
  return JSON.parse(auth)?.userId ?? null;
};

const clearSession = () => {
  sessionStorage.clear();
  localStorage.clear();
};

/* --------------------------------
   Password Validator
---------------------------------- */
const isValidPassword = (password: string) => {
  return (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z\d]/.test(password) &&
    password.length >= 8
  );
};

/* --------------------------------
   Component
---------------------------------- */

export default function ChangePassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const savePassword = async () => {
    const userId = getUserId();

    /* ---- Login Check ---- */
    if (!userId || userId === "0" || userId === "-") {
      alert("Please login to change the password.");
      return;
    }

    /* ---- Confirm Password Check ---- */
    if (form.newPassword !== form.confirmPassword) {
      alert("Confirm password not matched.");
      return;
    }

    /* ---- Password Strength ---- */
    if (!isValidPassword(form.newPassword)) {
      alert(
        "Passwords must contain at least eight characters, including uppercase, lowercase letters, special character and numbers."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        password: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
        passwordExpired: false,
      };

      const response = await updatePassword(userId, payload);

      if (response.status === "error") {
        showSnackbar(response.err, "error");
        return;
      }

      if (response.status === "success") {
        showSnackbar(response.message, "success");
      }

      /* ---- Clear Session & Redirect ---- */
      clearSession();
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      alert("Something went wrong while changing password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, []);

  return (
    <Box sx={{ px: 4, py: 3 }}>
      {/* Page Header */}
      <Typography variant="h5" fontWeight={700} mb={3} mt={8}>
        Change Password
      </Typography>

      {/* Content Card */}
      <Paper sx={{ p: 4, maxWidth: 900 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          mb={3}
          color="text.secondary"
        >
          Update your account password
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
          }}
        >
          <TextField
            label="Current Password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
          }}
        >
          <Button variant="contained" onClick={savePassword} disabled={loading}>
            {loading ? "Updating..." : "Save Password"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
