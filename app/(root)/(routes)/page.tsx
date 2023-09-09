"use client";

import { useEffect } from "react";

import { useAddStoreModal } from "@/hooks/use-add-store-modal";

const SetupPage = () => {
  const { isOpen, onOpen } = useAddStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
