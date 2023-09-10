"use client";

import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";

interface DeleteUserButtonProps {
  key: string;
  userId: string;
  setUsers: any;
}

export const DeleteUserButton: FC<DeleteUserButtonProps> = ({
  key,
  userId,
  setUsers,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/auth/users/${userId}`);

      toast.success("User berhasil dihapus.");
      setUsers(response.data?.users);
    } catch (error) {
      toast.error("Gagal menghapus user.");
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
        <Trash2Icon key={key} className="w-6 h-6" />
      </Button>
    </>
  );
};
