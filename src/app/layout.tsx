"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SideDrawer from "@/components/layout/SideDrawer/SideDrawer";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";
import Navbar from "@/components/layout/NavBar/NavBar";
import { usePathname, useRouter } from "next/navigation";
import { SnackbarProvider } from "@/components/ui/Snakebar/SnackbarProvider";
import { useEffect } from "react";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ["/login", "/signup", "/faq"];

  const hideLayout = publicRoutes.includes(pathname);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Not logged in → block protected routes
    if (!token && !isPublicRoute) {
      router.replace("/login");
    }

    // Logged in → block login/signup
    if (token && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider>
                <div style={{ display: "flex" }}>
                  {!hideLayout && <SideDrawer />}
                  {!hideLayout && <Navbar />}
                  <main style={{ flexGrow: 1 }}>{children}</main>
                </div>
              </SnackbarProvider>
            </ThemeProvider>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
