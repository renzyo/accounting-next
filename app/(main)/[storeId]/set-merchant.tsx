/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMerchantList } from "@/hooks/use-merchant-list-modal";
import { Merchant } from "@prisma/client";
import { useEffect } from "react";

const SetMerchant = ({ merchants }: { merchants: Merchant[] }) => {
  const merchantStore = useMerchantList();

  useEffect(() => {
    merchantStore.setMerchantList(merchants);
  }, []);

  return null;
};

export default SetMerchant;
