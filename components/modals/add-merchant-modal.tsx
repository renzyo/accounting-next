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
import { useAddMerchantModal } from "@/hooks/use-add-merchant-modal";
import { useParams, useRouter } from "next/navigation";
import { useMerchantList } from "@/hooks/use-merchant-list-modal";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(1),
});

export const AddMerchantModal = () => {
  const t = useTranslations("Merchant");

  const addMerchantModal = useAddMerchantModal();
  const merchantListStore = useMerchantList();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (addMerchantModal.isEditing) {
      form.setValue("name", addMerchantModal.merchantData?.name ?? "");
    }
  }, [addMerchantModal.isEditing, addMerchantModal.merchantData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (addMerchantModal.isEditing) {
        await axios.put(
          `/api/${params.storeId}/merchants/${addMerchantModal.merchantData?.id}`,
          values
        );

        const merchantList = merchantListStore.merchantList ?? [];
        const updatedMerchant = merchantList.find(
          (merchant) => merchant.id === addMerchantModal.merchantData?.id
        )!;
        updatedMerchant.name = values.name;
        merchantList.splice(
          merchantList.indexOf(updatedMerchant),
          1,
          updatedMerchant
        );

        merchantListStore.setMerchantList(merchantList);
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/merchants`,
          values
        );

        const merchantList = merchantListStore.merchantList ?? [];

        merchantListStore.setMerchantList(
          merchantList.concat({
            id: response.data.id,
            name: response.data.name,
          })
        );
      }

      if (addMerchantModal.isEditing) {
        toast.success(t("updateMerchantSuccess"));
      } else {
        toast.success(t("addMerchantSuccess"));
      }
      form.reset();
      addMerchantModal.setIsEditing(false);
      addMerchantModal.onClose();
      router.refresh();
    } catch (error) {
      toast.error(t("merchantError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        addMerchantModal.isEditing
          ? t("updateMerchantTitle")
          : t("addMerchantTitle")
      }
      description={
        addMerchantModal.isEditing
          ? t("updateMerchantDescription")
          : t("addMerchantDescription")
      }
      isOpen={addMerchantModal.isOpen}
      onClose={() => {
        form.reset();
        addMerchantModal.setIsEditing(false);
        addMerchantModal.onClose();
      }}
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
                      <FormLabel>{t("merchantName")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder={t("merchantNamePlaceholder")}
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
                    onClick={addMerchantModal.onClose}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {addMerchantModal.isEditing
                      ? t("updateMerchantButton")
                      : t("addMerchantButton")}
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
