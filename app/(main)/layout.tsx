import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/navbar";
import prismadb from "@/lib/prisma";
import { cookies } from "next/headers";
import { appDesc, appName } from "@/lib/static";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appName,
  description: appDesc,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RootLayout;

