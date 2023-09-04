"use client";

import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToasterProvider } from "@/providers/toaster-provider";
import { appDesc, appName } from "@/lib/static";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appName,
  description: appDesc,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
