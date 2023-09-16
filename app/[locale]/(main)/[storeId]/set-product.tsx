/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useProduct } from "@/hooks/use-product";
import { ProductData } from "@/lib/types";
import { useEffect } from "react";

const SetProduct = ({ products }: { products: ProductData[] }) => {
  const productStore = useProduct();

  useEffect(() => {
    productStore.setProducts(products);
  }, []);

  return null;
};

export default SetProduct;
