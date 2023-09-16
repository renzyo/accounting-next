"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

const TableHeader = ({
  variant,
  name,
  onClick,
}: {
  variant: string;
  name: string;
  onClick?: () => void;
}) => {
  const t = useTranslations("TableHeader");

  if (variant === "normal")
    return <div className="flex items-center justify-center">{t(name)}</div>;

  if (variant === "sortable")
    return (
      <div className="flex">
        <Button variant="ghost" onClick={onClick}>
          {t(name)}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );

  if (variant === "sortable-center")
    return (
      <div className="flex items-center justify-center">
        <Button variant="ghost" onClick={onClick}>
          {t(name)}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );

  return <div>{t(name)}</div>;
};

export default TableHeader;
