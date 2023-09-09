"use client";

import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { useStoreList } from "@/hooks/use-store-list-modal";

interface DeleteStoreButtonProps {
  key: string;
  storeId: string;
}

export const DeleteStoreButton: FC<DeleteStoreButtonProps> = ({
  key,
  storeId,
}) => {
  const storeListStore = useStoreList();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${storeId}`);

      const storeList = storeListStore.storeList ?? [];
      const newStoreList = storeList.filter((store) => store.id !== storeId);

      storeListStore.setStoreList(newStoreList);

      toast.success("Toko berhasil dihapus.");

      router.push("/");
    } catch (error) {
      toast.error(
        "Gagal menghapus toko, pastikan bahwa tidak ada penjualan dan produk pada toko ini."
      );
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
