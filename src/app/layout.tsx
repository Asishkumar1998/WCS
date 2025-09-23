'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from './store/store';
import SideDrawer from '@/components/layout/SideDrawer/SideDrawer';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme/theme';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'], // adjust as needed
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <div style={{ display: 'flex' }}>
                <SideDrawer />
                <main style={{ flexGrow: 1, padding: '1rem' }}>
                  {children}
                </main>
              </div>
            </ThemeProvider>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
