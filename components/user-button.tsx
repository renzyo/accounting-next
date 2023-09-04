import { cookies } from "next/headers";
import { Avatar, AvatarFallback } from "./ui/avatar";
import prismadb from "@/lib/prisma";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import DropdownContent from "./dropdown-content";

export default async function UserButton() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });

  const name = user?.name as string;
  const initial = name?.charAt(0);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownContent name={name} />
      </DropdownMenu>
    </div>
  );
}
