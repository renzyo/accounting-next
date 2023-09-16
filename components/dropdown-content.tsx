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
import { useLocale, useTranslations } from "next-intl";

interface DropdownContentProps {
  name: string;
}

export default function DropdownContent({ name }: DropdownContentProps) {
  const t = useTranslations("ManageUser");
  const lang = useLocale();
  const params = useParams();
  const router = useRouter();

  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{name}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          router.push(`/${lang}/${params.storeId}/profile`);
        }}
      >
        {t("profileButton")}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          router.push(`/${lang}/${params.storeId}/manage-user`);
        }}
      >
        {t("manageUserButton")}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          router.push(`/${lang}/logout`);
        }}
      >
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
