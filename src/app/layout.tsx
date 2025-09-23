'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from './store/store';
import SideDrawer from '@/components/layout/SideDrawer/SideDrawer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <div style={{ display: 'flex' }}>
              <SideDrawer />
              <main style={{ flexGrow: 1, padding: '1rem' }}>
                {children}
              </main>
            </div>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
