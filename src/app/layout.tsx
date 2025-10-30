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
import { usePathname } from "next/navigation";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // adjust as needed
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideLayout = ["/login", "/signup"].includes(pathname);

  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <div style={{ display: "flex" }}>
                {!hideLayout && <SideDrawer />}
                {!hideLayout && <Navbar />}
                <main style={{ flexGrow: 1 }}>{children}</main>
              </div>
            </ThemeProvider>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
