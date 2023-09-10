import "../../globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import prismadb from "@/lib/prisma";
import { appDesc, appName } from "@/lib/static";
import SetProduct from "./set-product";
import SetMerchant from "./set-merchant";
import { ModalProvider } from "@/providers/modal-provider";
import SetStore from "./set-store";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const userId = cookies().get("userId")?.value;

  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    redirect("/logout");
  }

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

