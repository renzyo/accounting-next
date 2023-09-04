"use client";

import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/use-product";
import { useProductModal } from "@/hooks/use-product-modal";
import { Product } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import React, { useEffect } from "react";

const AddProduct = ({ products }: { products: Product[] }) => {
  const productModalStore = useProductModal();
  const productStore = useProduct();

  useEffect(() => {
    productStore.setProducts(products);
  }, []);

  return (
    <Button onClick={() => productModalStore.onOpen()}>
      <PlusIcon className="w-4 h-4 mr-2" />
      Tambah Produk
    </Button>
  );
};

export default AddProduct;
