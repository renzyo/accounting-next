"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAddStoreModal } from "@/hooks/use-add-store-modal";
import { useStoreList } from "@/hooks/use-store-list-modal";
import { Store } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const t = useTranslations("Store");
  const router = useRouter();
  const storeList = useStoreList();
  const storeModalStore = useAddStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (storeModalStore.isEditing) {
      form.setValue("name", storeModalStore.storeData?.name ?? "");
    }
  }, [storeModalStore.isEditing, storeModalStore.storeData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (storeModalStore.isEditing) {
        await axios.put(`/api/stores/${storeModalStore.storeData?.id}`, values);
        toast.success(t("updateStoreSuccess"));

        const oldStoreList = storeList.storeList ?? [];
        const updatedStore = oldStoreList.find(
          (store) => store.id === storeModalStore.storeData?.id
        )!;
        updatedStore.name = values.name;
        oldStoreList.splice(
          oldStoreList.indexOf(updatedStore),
          1,
          updatedStore
        );

        storeList.setStoreList(oldStoreList);
        form.reset();
        storeModalStore.setIsEditing(false);
        storeModalStore.onClose();
        router.refresh();
      } else {
        const response = await axios.post("/api/stores", values);

        const oldStoreList = storeList.storeList ?? [];

        storeList.setStoreList(oldStoreList.concat(response.data as Store));

        toast.success(t("addStoreSuccess"));
        form.reset();
        storeModalStore.setIsEditing(false);
        storeModalStore.onClose();
        window.location.assign(`/${response.data.id}`);
      }
    } catch (error) {
      toast.error(t("storeError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        storeModalStore.isEditing ? t("updateStoreTitle") : t("addStoreTitle")
      }
      description={
        storeModalStore.isEditing
          ? t("updateStoreDescription")
          : t("addStoreDescription")
      }
      isOpen={storeModalStore.isOpen}
      onClose={storeModalStore.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("storeName")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder={t("storeNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={storeModalStore.onClose}
                  >
                    {t("cancelButton")}
                  </Button>
                  <Button disabled={loading} type="submit">
                    {storeModalStore.isEditing
                      ? t("updateStoreButton")
                      : t("addStoreButton")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
