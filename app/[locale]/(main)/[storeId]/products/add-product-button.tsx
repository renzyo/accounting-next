/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { useProductModal } from "@/hooks/use-product-modal";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const AddProduct = () => {
  const t = useTranslations("Products");
  const productModalStore = useProductModal();

  return (
    <Button onClick={() => productModalStore.onOpen()}>
      <PlusIcon className="w-4 h-4 mr-2" />
      {t("addProductButton")}
    </Button>
  );
};

export default AddProduct;
