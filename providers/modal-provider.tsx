"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";
import { ProductModal } from "@/components/modals/product-modal";
import { SaleModal } from "@/components/modals/sale-modal";
import { MerchantListModal } from "@/components/modals/merchant-list-modal";
import { AddMerchantModal } from "@/components/modals/add-merchant-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AddMerchantModal />
      <MerchantListModal />
      <StoreModal />
      <ProductModal />
      <SaleModal />
    </>
  );
};
