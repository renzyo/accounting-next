import { Inter } from "next/font/google";

import { ModalProvider } from "@/providers/modal-provider";

import "./globals.css";
import { ToasterProvider } from "@/providers/toaster-provider";
import { appDesc, appName } from "@/lib/static";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: appName,
  description: appDesc,
};

export default async function RootLayout({
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
