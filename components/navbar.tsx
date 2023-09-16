import prismadb from "@/lib/prisma";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import UserButton from "./user-button";
import { cookies } from "next/headers";
import LocaleSwitcher from "./locale-switcher";

export const Navbar = async () => {
  const userId = cookies().get("userId")?.value;

  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });

  const stores = await prismadb.store.findMany();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} user={user!} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <LocaleSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
};
