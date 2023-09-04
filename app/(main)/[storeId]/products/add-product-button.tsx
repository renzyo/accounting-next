"use client";

import { Button } from "@/components/ui/button";
import { useProductModal } from "@/hooks/use-product-modal";
import { PlusIcon } from "lucide-react";
import React from "react";

const AddProduct = () => {
  const addProductModal = useProductModal();

  return (
    <Button onClick={() => addProductModal.onOpen()}>
      <PlusIcon className="w-4 h-4 mr-2" />
      Tambah Produk
    </Button>
  );
};

export default AddProduct;
