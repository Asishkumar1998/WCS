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
import { useEffect, useState } from "react";
import { getAuth } from "./utils/auth";
import Script from "next/script";
import GoDaddySeal from "./goDaddy";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const securityRibbonHeight = 35;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ["/login", "/signup", "/thankyou", "/sso"];

  const hideLayout = publicRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const validateAccess = () => {
      const auth = getAuth();

      if (!auth && !isPublicRoute) {
        setIsAuthed(false);
        setAuthChecked(true);
        router.replace("/login");
        return;
      }

      if (!auth && (pathname === "/login" || pathname === "/signup" || pathname === "/thankyou")) {
        setIsAuthed(true);
        setAuthChecked(true);
        return;
      }

      setIsAuthed(!!auth || isPublicRoute);
      setAuthChecked(true);
    };

    validateAccess();

    const handlePageShow = () => {
      validateAccess();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wcs-logout-at") {
        validateAccess();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePageShow);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePageShow);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isPublicRoute, pathname, router]);

  const shouldRenderApp = isPublicRoute || (authChecked && isAuthed);

  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        {/* {pathname === "/login" && (
          <>
            <Script
              src="https://seal.godaddy.com/getSeal?sealID=DXP8dPL4iK9BQhiIblVRlrORv2iWSDAA1l11hG2wU6h4gQskGKKSgB58Fcm7"
              strategy="afterInteractive"
            />
            <span id="siteseal" className="godaddy-seal-position" />
          </>
        )} */}
        {shouldRenderApp ? (
          <AppRouterCacheProvider>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <div style={{height:`35px`,width: "100%",backgroundColor: pathname==="/login"?"tramsparent":"white",
                  position: "fixed",top: 0,left: 0,zIndex: 999
                  }} >
                  <GoDaddySeal />
                </div>
                <SnackbarProvider>
                  <div
                    style={{
                      display: "flex",
                      minHeight: "100vh",
                      paddingTop: "35px",
                      boxSizing: "border-box",
                    }}
                  >
                    {!hideLayout && <SideDrawer />}
                    {!hideLayout && <Navbar />}
                    <main style={{ flexGrow: 1, minWidth: 0 }}>{children}</main>
                  </div>
                </SnackbarProvider>
              </ThemeProvider>
            </Provider>
          </AppRouterCacheProvider>
        ) : (
          <div style={{ minHeight: "100vh" }} />
        )}
      </body>
    </html>
  );
}


