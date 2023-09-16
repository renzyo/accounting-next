"use client";

import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { useMerchantList } from "@/hooks/use-merchant-list-modal";
import { useTranslations } from "next-intl";

interface deleteMerchantButtonProps {
  key: string;
  merchantId: string;
}

export const DeleteMerchantButton: FC<deleteMerchantButtonProps> = ({
  key,
  merchantId,
}) => {
  const t = useTranslations("Merchant");
  const merchantListStore = useMerchantList();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/merchants/${merchantId}`);

      const merchantList = merchantListStore.merchantList ?? [];
      const newMerchantList = merchantList.filter(
        (merchant) => merchant.id !== merchantId
      );

      merchantListStore.setMerchantList(newMerchantList);

      toast.success(t("deleteMerchantSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("deleteMerchantError"));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
        key={key}
      />
      <Button
        key={key}
        variant="ghost"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Trash2Icon key={key} className="w-4 h-4" />
      </Button>
    </>
  );
};
