import "../globals.css";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prisma";
import { StoreModal } from "@/components/modals/store-modal";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await prismadb.store.findFirst();

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <>
      <StoreModal />
      {children}
    </>
  );
}
