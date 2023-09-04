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
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useProduct } from "@/hooks/use-product";

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
      ? saleModalStore.saleData
      : {
          merchant: "",
          productId: "",
          quantity: "",
          profit: "",
        },
  });

  useEffect(() => {
    if (saleModalStore.isEditing) {
      form.setValue("merchant", saleModalStore.saleData?.merchant ?? "");
      form.setValue("productId", saleModalStore.saleData?.productId ?? "");
      form.setValue("quantity", saleModalStore.saleData?.quantity ?? "");
      form.setValue("profit", saleModalStore.saleData?.profit ?? "");
    }
  }, [saleModalStore.isEditing, saleModalStore.saleData, form]);

  useEffect(() => {
    const quantity = form.watch("quantity");
    const product = productStore.products.find(
      (product) => product.id === form.watch("productId")
    );

    if (quantity && product) {
      const profit = Number(quantity) * product.price;
      form.setValue("profit", profit.toString());
    }
  }, [productStore.products, form]);

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
        toast.success("Product updated successfully");
        saleModalStore.setIsEditing(false);
      } else {
        await axios.post(`/api/${params.storeId}/sales`, {
          ...sale,
          type: "single",
        });
        toast.success("Store created successfully");
      }

      saleModalStore.onClose();
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={saleModalStore.isEditing ? "Edit Produk" : "Tambah Produk"}
      description={
        saleModalStore.isEditing
          ? "Perbaharui produk yang sudah ada."
          : "Tambahkan produk baru ke toko."
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? merchants.find(
                                    (merchant) => merchant.value === field.value
                                  )?.label
                                : "Pilih merchant"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Search framework..." />
                            <CommandEmpty>Tidak ada produk.</CommandEmpty>
                            <CommandGroup>
                              {merchants.map((merchant) => (
                                <CommandItem
                                  value={merchant.label}
                                  key={merchant.value}
                                  onSelect={() => {
                                    form.setValue("merchant", merchant.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      merchant.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {merchant.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? productStore.products.find(
                                    (product) => product.id === field.value
                                  )?.name
                                : "Pilih Produk"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Cari produk..." />
                            <CommandEmpty>Tidak ada produk.</CommandEmpty>
                            <CommandGroup>
                              {productStore.products.map((product) => (
                                <CommandItem
                                  value={product.id}
                                  key={product.id}
                                  onSelect={() => {
                                    form.setValue("productId", product.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      product.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {product.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                            disabled={true}
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
                      ? "Perbaharui Produk"
                      : "Tambahkan Produk"}
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
