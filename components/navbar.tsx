import prismadb from "@/lib/prisma";
import { cookies } from "next/headers";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import UserButton from "./user-button";

export const Navbar = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  );
};
