/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useStoreList } from "@/hooks/use-store-list-modal";
import { Store } from "@prisma/client";
import { useEffect } from "react";

const SetStore = ({ stores }: { stores: Store[] }) => {
  const storeList = useStoreList();

  useEffect(() => {
    storeList.setStoreList(stores);
  }, []);

  return null;
};

export default SetStore;
