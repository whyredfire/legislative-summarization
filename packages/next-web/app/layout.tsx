import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/data/globals";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/footer";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <main className="flex flex-1 container container-wrapper flex-col justify-center items-center">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
