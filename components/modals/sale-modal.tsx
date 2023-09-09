"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { useMerchantList } from "@/hooks/use-merchant-list-modal";
import { ScrollArea } from "../ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  id: z.string().min(1),
  merchantId: z.string().min(1),
  productId: z.string().min(1),
  saleDate: z.date({
    required_error: "Tanggal penjualan harus diisi.",
  }),
  quantity: z.string().min(1),
});

export const SaleModal = () => {
  const saleModalStore = useSaleModal();
  const merchantListStore = useMerchantList();
  const productStore = useProduct();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: saleModalStore.isEditing
      ? saleModalStore.saleData
      : {
          merchantId: "",
          productId: "",
          saleDate: new Date(),
          quantity: "",
        },
  });

  useEffect(() => {
    if (saleModalStore.isEditing) {
      form.setValue("merchantId", saleModalStore.saleData?.merchantId ?? "");
      form.setValue("productId", saleModalStore.saleData?.productId ?? "");
      form.setValue("quantity", saleModalStore.saleData?.quantity ?? "");
      form.setValue(
        "saleDate",
        saleModalStore.saleData?.saleDate ?? new Date()
      );
    }
  }, [saleModalStore.isEditing, saleModalStore.saleData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const sale = {
        merchantId: values.merchantId,
        productId: values.productId,
        saleDate: values.saleDate,
        quantity: parseInt(values.quantity),
      };

      if (saleModalStore.isEditing) {
        await axios.put(
          `/api/${params.storeId}/sales/${saleModalStore.saleData?.id}`,
          {
            ...sale,
            previousQuantity: parseInt(saleModalStore.saleData?.quantity!),
          }
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
      toast.error(
        "Tidak dapat menambahkan penjualan. Pastikan stok produk mencukupi."
      );
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
                  name="merchantId"
                  defaultValue={saleModalStore.saleData?.merchantId}
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
                          {merchantListStore.merchantList!.map((merchant) => (
                            <SelectItem
                              value={merchant.id}
                              key={merchant.id}
                              placeholder="Pilih Merchant..."
                            >
                              {merchant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <Button
                        variant="secondary"
                        type="button"
                        className="mt-2"
                        onClick={() => {
                          merchantListStore.onOpen();
                        }}
                      >
                        Kelola Merchant
                      </Button>
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
                          <ScrollArea className="h-[200px]">
                            {productStore.products.map((product) => (
                              <SelectItem
                                value={product.id}
                                key={product.id}
                                placeholder="Pilih produk..."
                              >
                                {product.name}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="saleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Penjualan</FormLabel>
                      <FormControl>
                        <div className="block">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : new Date()
                                }
                                onSelect={(date) => {
                                  if (date) field.onChange(date);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
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
