"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";

const LocaleSwitcher = () => {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleLocale = () => {
    startTransition(() => {
      router.replace(pathname, { locale: locale === "en" ? "id" : "en" });
    });
  };

  return (
    <Button variant="ghost" onClick={handleToggleLocale}>
      <Globe className="w-6 h-6" />
    </Button>
  );
};

export default LocaleSwitcher;
