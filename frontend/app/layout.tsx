import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/theme/theme-provider";

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/data/globals";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />
            <div className="container-wrapper container flex flex-1 items-center justify-center">
              {children}
            </div>
            <Footer />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
