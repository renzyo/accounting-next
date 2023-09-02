import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/navbar";
import prismadb from "@/lib/prisma";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RootLayout;

