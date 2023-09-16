/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useProduct } from "@/hooks/use-product";
import { Product } from "@prisma/client";
import { useEffect } from "react";

const SetProduct = ({ products }: { products: Product[] }) => {
  const productStore = useProduct();

  useEffect(() => {
    productStore.setProducts(products);
  }, []);

  return null;
};

export default SetProduct;
