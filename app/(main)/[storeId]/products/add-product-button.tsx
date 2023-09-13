/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { useProductModal } from "@/hooks/use-product-modal";
import { PlusIcon } from "lucide-react";
import React from "react";

const AddProduct = () => {
  const productModalStore = useProductModal();

  return (
    <Button onClick={() => productModalStore.onOpen()}>
      <PlusIcon className="w-4 h-4 mr-2" />
      Tambah Produk
    </Button>
  );
};

export default AddProduct;
