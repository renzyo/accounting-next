"use client";

import toast from "react-hot-toast";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface DropdownContentProps {
  name: string;
}

export default function DropdownContent({ name }: DropdownContentProps) {
  const params = useParams();
  const router = useRouter();

  async function handleLogout() {
    try {
      toast.success("Logged out");
      const response = await axios.get("/api/auth/logout");

      if (response.status === 200) {
        window.location.assign("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{name}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          router.push(`/${params.storeId}/profile`);
        }}
      >
        Profil Saya
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          router.push(`/${params.storeId}/manage-user`);
        }}
      >
        Kelola User
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  );
}
