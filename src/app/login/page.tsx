// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   IconButton,
//   //   IconButton,
//   InputAdornment,
//   OutlinedInput,
//   Typography,
// } from "@mui/material";
// import ReCAPTCHA from "react-google-recaptcha";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useRouter } from "next/navigation";
// import { loginUser } from "../utils/authSerivce";
// import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
// import Image from "next/image";

// const CustomerLogin = () => {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [captchaValid, setCaptchaValid] = useState<boolean>(false);

//   const { showSnackbar } = useSnackbar();

//   const handleChange = (key: string, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     try {
//       const res = await loginUser(form.email, form.password);

//       if (res?.authToken) {
//         localStorage.setItem("token", res.authToken);
//         router.push("/");
//       } else {
//         throw new Error("Invalid credentials");
//       }
//     } catch (err) {
//       showSnackbar("Invalid email or password", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCaptchaChange = (value: string | null) => {
//     setCaptchaValid(!!value);
//   };

//   const handleClickShowPassword = () => setShowPassword((show) => !show);
//   const handleMouseDownPassword = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();
//   };

//   const handleMouseUpPassword = (
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => {
//     event.preventDefault();
//   };

//   return (
//     <div>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Box>
//           <Typography margin="auto" variant="h5" gutterBottom color="#ffffff">
//             Sign In to SOS Portal
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               mt: 3,
//               width: "500px",
//             }}
//           >
//             <FormControl variant="outlined">
//               <OutlinedInput
//                 id="email-text-56626"
//                 placeholder="Email Address *"
//                 value={form.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 sx={{ backgroundColor: "#ffffff", mb: 1, borderRadius: "4px" }}
//                 required
//               />
//             </FormControl>
//             <FormControl variant="outlined">
//               <OutlinedInput
//                 id="password-text-25652"
//                 placeholder="Password"
//                 type={showPassword ? "text" : "password"}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label={
//                         showPassword
//                           ? "hide the password"
//                           : "display the password"
//                       }
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       onMouseUp={handleMouseUpPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 sx={{ backgroundColor: "#ffffff", borderRadius: "4px" }}
//                 onChange={(e) => handleChange("password", e.target.value)}
//                 value={form.password}
//                 required
//               />
//             </FormControl>

//             <Box sx={{ m: 3, display: "flex", justifyContent: "center" }}>
//               <ReCAPTCHA
//                 sitekey="6LeElDUsAAAAAPMaM1facZ4cNKil_cdBznsf3wmj"
//                 onChange={handleCaptchaChange}
//               />
//             </Box>

//             <Button
//               fullWidth
//               variant="contained"
//               disableElevation
//               color="error"
//               onClick={handleSubmit}
//               disabled={loading}
//               sx={{
//                 height: "45px",
//                 "&.Mui-disabled": {
//                   backgroundColor: "#d32f2f",
//                   color: "#fff",
//                   opacity: 1,
//                 },
//               }}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               mt: 2,
//             }}
//           >
//             <Typography variant="body2" gutterBottom color="#ffffff">
//               {/* New User? {signUpNow} */}
//             </Typography>
//             <Button
//               sx={{
//                 p: 0,
//                 textTransform: "none",
//                 color: "#ffffff",
//               }}
//             >
//               Forget password?
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           position: "absolute",
//           bottom: "5%",
//           right: "5%",
//         }}
//       >
//         <Image src="/logo-wcs.png" alt={"logo"} width={80} height={60} />
//         <Typography margin="auto" variant="h6" gutterBottom color="#ffffff">
//           Powered by WCS
//         </Typography>
//       </Box>
//     </div>
//   );
// };

// export default CustomerLogin;
"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginUser } from "../utils/authSerivce";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";

const CustomerLogin = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  const handleSubmit = async () => {
    if (!captchaValid) {
      showSnackbar("Please verify captcha", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      if (res?.authToken) {
        localStorage.setItem("token", res.authToken);
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
        justifyContent: "center",
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
        }}
      >
        {/* LOGO */}
        <Image
          src="/WCS-Express-Logo.png"
          alt="WCS Logo"
          width={130}
          height={130}
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
            <Typography variant="body2">
              20 Courthouse Square, Suite 219, Rockville, Maryland, 20850 USA
            </Typography>
            <Typography variant="body2">
              Email: wcs@wcss.com &nbsp; | &nbsp; Phone: +1 301 605 1500
            </Typography>
            <Typography variant="body2">
              Toll Free: 1-866-ALL-DOCS (255-3627)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Login Card */}
      <Box
        sx={{
          width: 520,
          p: 4,
          borderRadius: 3,
          // background: "rgba(15, 35, 65, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight={600}
          color="#fff"
          mb={3}
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

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Typography variant="body2" color="#fff">
            New to WCS?{" "}
            <span
              style={{
                color: "#ff4d4f",
                cursor: "pointer",
              }}
            >
              Sign Up Now
            </span>
          </Typography>

          <Typography variant="body2" color="#fff" sx={{ cursor: "pointer" }}>
            Forgot password?
          </Typography>
        </Box> */}
      </Box>

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
