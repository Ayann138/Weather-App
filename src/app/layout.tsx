import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather AI App",
  description: "AI-powered weather insights and forecasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="weather-ai-theme"
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_oklch(0.96_0.02_230)_0%,_oklch(0.98_0.01_200)_45%,_oklch(0.97_0.015_160)_100%)] dark:bg-[radial-gradient(ellipse_at_top,_oklch(0.22_0.03_240)_0%,_oklch(0.16_0.02_250)_40%,_oklch(0.13_0.015_260)_100%)]">
              <Header />
              <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8">
                {children}
              </main>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
