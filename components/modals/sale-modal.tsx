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
import { ProductData } from "@/lib/types";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  id: z.string().min(1),
  merchantId: z.string().min(1),
  productId: z.string().min(1),
  saleDate: z.date({
    required_error: "Date is required",
  }),
  quantity: z.string().min(1),
});

export const SaleModal = () => {
  const tProducts = useTranslations("Products");
  const t = useTranslations("Sales");

  const saleModalStore = useSaleModal();
  const productListStore = useProduct();
  const merchantListStore = useMerchantList();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get(`/api/${params.storeId}/products`);
        const products = response.data.products as ProductData[];

        setProducts(products);
      } catch (error) {
        console.log(error);
        toast.error(tProducts("loadProductFailed"));
      } finally {
        setLoading(false);
      }
    }

    if (productListStore.productUpdated) {
      productListStore.setProductUpdated(false);
    }
    getProducts();
  }, [params.storeId, productListStore, tProducts]);

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
        toast.success(t("updateSaleSuccess"));
        saleModalStore.setIsEditing(false);
      } else {
        await axios.post(`/api/${params.storeId}/sales`, {
          ...sale,
          type: "single",
        });
        toast.success(t("addSaleSuccess"));
      }

      form.reset();
      router.refresh();
      saleModalStore.setSaleUpdated(true);
      saleModalStore.onClose();
    } catch (error) {
      console.log(error);
      toast.error(t("saleError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        saleModalStore.isEditing ? t("updateSaleTitle") : t("addSaleTitle")
      }
      description={
        saleModalStore.isEditing
          ? t("updateSaleDescription")
          : t("addSaleDescription")
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
                      <FormLabel>{t("merchant")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("merchantPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {merchantListStore.merchantList!.map((merchant) => (
                            <SelectItem
                              value={merchant.id}
                              key={merchant.id}
                              placeholder={t("merchantPlaceholder")}
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
                        {t("manageMerchantButton")}
                      </Button>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("product")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("productPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="min-h-[50px]">
                            {products.length === 0 ? (
                              <p>{t("noProduct")}</p>
                            ) : (
                              products.map((product) => (
                                <SelectItem
                                  value={product.id}
                                  key={product.id}
                                  placeholder={t("productPlaceholder")}
                                >
                                  {product.name}
                                </SelectItem>
                              ))
                            )}
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
                      <FormLabel>{t("saleDate")}</FormLabel>
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
                                disabled={loading}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>{t("saleDatePlaceholder")}</span>
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
                      <FormLabel>{t("quantity")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder={t("quantityPlaceholder")}
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
                    {t("cancelButton")}
                  </Button>
                  <Button
                    disabled={loading}
                    type="button"
                    onClick={() => {
                      onSubmit(form.getValues());
                    }}
                  >
                    {saleModalStore.isEditing
                      ? t("updateSaleButton")
                      : t("addSaleButton")}
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
