import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { PWAProvider } from "@/components/pwa-provider";

import "./globals.css";

const fontSans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans"
});

const fontSerif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "W8: stuck together",
  description: "Лёгкий дневник ожидания. Одна сессия, короткая запись и тихое ощущение, что ты не один.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon-maskable.svg"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "W8"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: "#fcf7f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${fontSans.variable} ${fontSerif.variable}`}>
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  );
}
