"use client";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/context/providers";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayoutForPaths = [
    "/explore-meera/",
    "/explore-meera",
    "/demostoreleadform",
    "/demostoreleadform/",
  ];
  const shouldHideLayout = hideLayoutForPaths.includes(pathname);

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("bg-white antialiased dark:bg-black")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar is commented out */}
          {/* {!shouldHideLayout && <Navbar />} */}
          {children}
          {!shouldHideLayout && <Footer />}
          <Analytics /> {/* Add Analytics component here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
