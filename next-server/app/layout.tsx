import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/data/globals";
import { ThemeProvider } from "@/context/theme-provider";

import { unstable_ViewTransition as ViewTransition } from "react";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ViewTransition>
          <div className="flex min-h-screen flex-col">
            <ThemeProvider>
              <SiteHeader />
              <div className="container-wrapper container flex flex-1 items-center justify-center">
                {children}
              </div>
              <Footer />
              <Toaster richColors position="top-center" />
            </ThemeProvider>
          </div>
        </ViewTransition>
      </body>
    </html>
  );
}
