import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import prismadb from "@/lib/prisma";
import { appDesc, appName } from "@/lib/static";
import SetProduct from "./set-product";
import SetMerchant from "./set-merchant";
import { ModalProvider } from "@/providers/modal-provider";
import SetStore from "./set-store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appName,
  description: appDesc,
};

const RootLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const stores = await prismadb.store.findMany();

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const merchants = await prismadb.merchant.findMany();

  return (
    <>
      <ModalProvider />
      <Navbar />
      <SetStore stores={stores} />
      <SetProduct products={products} />
      <SetMerchant merchants={merchants} />
      {children}
    </>
  );
};

export default RootLayout;

