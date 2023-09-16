"use client";

import "./globals.css";
import { redirect } from "next/navigation";
import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/loading-indicator";
import axios from "axios";
import { StoreData } from "@/lib/types";
import { useAddStoreModal } from "@/hooks/use-add-store-modal";
import { useLocale } from "next-intl";

export default function MainPage() {
  const locale = useLocale();
  const [store, setStore] = useState<StoreData>();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen } = useAddStoreModal();

  useEffect(() => {
    async function getStore() {
      try {
        const response = await axios.get("/api/stores");

        setStore(response.data.store);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getStore();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!store) {
      if (!isOpen) {
        onOpen();
      }
    }
  }, [isOpen, onOpen, store, loading]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (store) {
    redirect(`/${locale}/${store.id}`);
  }

  return (
    <>
      <StoreModal />
    </>
  );
}
