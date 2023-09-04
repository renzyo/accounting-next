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
import { useParams, useRouter } from "next/navigation";
import { useSaleModal } from "@/hooks/use-sale-modal";
import { useProduct } from "@/hooks/use-product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  id: z.string().min(1),
  merchant: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.string().min(1),
  profit: z.string().min(1),
});

const merchants = [
  { label: "Shopee", value: "Shopee" },
  { label: "Tokopedia", value: "Tokopedia" },
  { label: "Lazada", value: "Lazada" },
  { label: "TikTok", value: "TikTok" },
] as const;

export const SaleModal = () => {
  const saleModalStore = useSaleModal();
  const productStore = useProduct();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: saleModalStore.isEditing
      ? {
          ...saleModalStore.saleData,
          profit: saleModalStore.saleData?.profit
            .replaceAll(".", "")
            .replaceAll(",00", "")
            .replaceAll("Rp ", ""),
        }
      : {
          merchant: "",
          productId: "",
          quantity: "",
          profit: "",
        },
  });

  useEffect(() => {
    if (saleModalStore.isEditing) {
      const profit = saleModalStore.saleData?.profit
        .replaceAll(".", "")
        .replaceAll(",00", "")
        .replaceAll("Rp ", "");
      form.setValue("merchant", saleModalStore.saleData?.merchant ?? "");
      form.setValue("productId", saleModalStore.saleData?.productId ?? "");
      form.setValue("quantity", saleModalStore.saleData?.quantity ?? "");
      form.setValue("profit", profit ?? "");
    }
  }, [saleModalStore.isEditing, saleModalStore.saleData, form]);

  const formProductId = form.watch("productId");
  const formQuantity = form.watch("quantity");

  useEffect(() => {
    const product = productStore.products.find(
      (product) => product.id === formProductId
    );

    if (formQuantity && product && product.price !== 0) {
      const profit = Number(formQuantity) * product.price;
      form.setValue("profit", profit.toString());
    }
  }, [productStore.products, formProductId, formQuantity, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const sale = {
        merchant: values.merchant,
        productId: values.productId,
        quantity: parseInt(values.quantity),
        profit: parseInt(values.profit),
      };

      if (saleModalStore.isEditing) {
        await axios.put(
          `/api/${params.storeId}/sales/${saleModalStore.saleData?.id}`,
          sale
        );
        toast.success("Penjualan berhasil diperbaharui");
        saleModalStore.setIsEditing(false);
      } else {
        await axios.post(`/api/${params.storeId}/sales`, {
          ...sale,
          type: "single",
        });
        toast.success("Penjualan berhasil ditambahkan");
      }

      saleModalStore.onClose();
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        saleModalStore.isEditing ? "Perbaharui Penjualan" : "Tambah Penjualan"
      }
      description={
        saleModalStore.isEditing
          ? "Perbaharui penjualan yang sudah ada."
          : "Tambahkan penjualan baru ke toko."
      }
      isOpen={saleModalStore.isOpen}
      onClose={() => {
        if (saleModalStore.isEditing) {
          saleModalStore.setIsEditing(false);
        }
        form.reset();
        saleModalStore.onClose();
      }}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="merchant"
                  defaultValue={saleModalStore.saleData?.merchant}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Merchant</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Merchant..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {merchants.map((merchant) => (
                            <SelectItem
                              value={merchant.value}
                              key={merchant.value}
                              placeholder="Pilih Merchant..."
                            >
                              {merchant.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Produk</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Produk..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productStore.products.map((product) => (
                            <SelectItem
                              value={product.id}
                              key={product.id}
                              placeholder="Pilih produk..."
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Terjual</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Unit Terjual"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profit"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Pendapatan</FormLabel>
                        <FormControl>
                          <Input
                            disabled={
                              productStore.products.find(
                                (product) => product.id === formProductId
                              )?.price === 0
                                ? false
                                : true
                            }
                            placeholder="Pendapatan"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={() => {
                      if (saleModalStore.isEditing) {
                        saleModalStore.setIsEditing(false);
                      }
                      form.reset();
                      saleModalStore.onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="button"
                    onClick={() => {
                      onSubmit(form.getValues());
                    }}
                  >
                    {saleModalStore.isEditing
                      ? "Perbaharui Penjualan"
                      : "Tambahkan Penjualan"}
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
