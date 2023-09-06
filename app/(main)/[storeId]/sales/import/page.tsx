"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/use-product";
import axios from "axios";
import { useParams } from "next/navigation";
import { Product } from "@prisma/client";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMerchantList } from "@/hooks/use-merchant-list-modal";

const formSchema = z.object({
  merchantId: z.string().min(1),
});

type SaleData = {
  merchantId: string;
  name: string;
  quantity: number;
};

type MerchantData = {
  id: string;
  name: string;
};

const ImportPage = () => {
  const productStore = useProduct();
  const merchantListStore = useMerchantList();
  const params = useParams();
  const [merchants, setMerchants] = useState<MerchantData[]>(
    [] as MerchantData[]
  );

  useEffect(() => {
    const shopee = merchantListStore.merchantList?.find(
      (merchant) => merchant.name === "Shopee"
    )!;
    const tokped = merchantListStore.merchantList?.find(
      (merchant) => merchant.name === "Tokopedia"
    )!;
    const lazada = merchantListStore.merchantList?.find(
      (merchant) => merchant.name === "Lazada"
    )!;
    const tiktok = merchantListStore.merchantList?.find(
      (merchant) => merchant.name === "TikTok"
    )!;

    setMerchants([shopee, tokped, lazada, tiktok]);
  }, [merchantListStore.merchantList]);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantId: "",
    },
  });

  function getFile(file: File) {
    setSelectedFile(file);
  }

  const handleAddFromExcel = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile as File);
    reader.onload = async (e) => {
      // const filename = selectedFile?.name;
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sales = XLSX.utils.sheet_to_json(sheet);
      const salesData: SaleData[] = [];

      if (
        values.merchantId ===
        merchants.find((merchant) => merchant.name === "Lazada")?.id
      ) {
        // if (!filename?.toLowerCase().includes("lazada")) return;
        let i = 0;
        sales.forEach((sale: unknown) => {
          if (i > 2) {
            const saleData = sale as object;
            let name = "";
            let sold = 0;

            // loop saleData
            let j = 0;
            for (const [, value] of Object.entries(saleData)) {
              if (j === 0) {
                name = value as string;
              } else if (j === 13) {
                sold = parseInt(value as string);
                // } else if (j === 14) {
                //   profit = parseInt(value);
              }
              j++;
            }

            const tempSale: SaleData = {
              merchantId: values.merchantId,
              name,
              quantity: sold,
            };
            if (tempSale.quantity !== 0) salesData.push(tempSale);
          }
          i++;
        });
      } else if (
        values.merchantId ===
        merchants.find((merchant) => merchant.name === "Shopee")?.id
      ) {
        // if (!filename?.toLowerCase().includes("shopee")) return;
        sales.forEach((sale: unknown) => {
          const saleData = sale as object;
          let name = "";
          let sold = 0;

          for (const [key, value] of Object.entries(saleData)) {
            if (key === "Produk") {
              name = value as string;
            } else if (key === "Total Produk Dibayar") {
              sold = parseInt(value as string);
              // } else if (key === "Total Penjualan (Pesanan Dibayar) (IDR)") {
              //   profit = value;
              //   profit = parseInt(profit.toString().replace(/\./g, ""));
            }
          }

          const tempSale: SaleData = {
            merchantId: values.merchantId,
            name,
            quantity: sold,
          };

          if (tempSale.quantity !== 0) salesData.push(tempSale);
        });
      } else if (
        values.merchantId ===
        merchants.find((merchant) => merchant.name === "TikTok")?.id
      ) {
        // if (!filename?.toLowerCase().includes("tiktok")) return;
        let i = 0;
        sales.forEach((sale: unknown) => {
          if (i > 0) {
            const saleData = sale as object;
            let name = "";
            let sold = 0;

            // loop saleData
            let j = 0;
            for (const [, value] of Object.entries(saleData)) {
              if (j === 1) {
                name = value as string;
              } else if (j === 4) {
                sold = parseInt(value as string);
                // } else if (j === 2) {
                //   profit = value;
                //   profit = parseInt(
                //     profit.toString().replace("Rp", "").replace(/\./g, "")
                //   );
              }
              j++;
            }

            const tempSale: SaleData = {
              merchantId: values.merchantId,
              name,
              quantity: sold,
            };

            if (tempSale.quantity !== 0) salesData.push(tempSale);
          }
          i++;
        });
      } else if (
        values.merchantId ===
        merchants.find((merchant) => merchant.name === "Tokopedia")?.id
      ) {
        // if (!filename?.toLowerCase().includes("tokped")) return;
        const filteredSales: object[] = [];

        let i = 0;
        sales.forEach((sale: unknown) => {
          if (i > 2) {
            const saleData = sale as object;
            let j = 0;
            for (const [, value] of Object.entries(saleData)) {
              if (j === 3) {
                if (value === "Pesanan Selesai") {
                  filteredSales.push(saleData);
                }
              }
              if (j === 2) {
                if (value === "Pesanan Selesai") {
                  filteredSales.push(saleData);
                }
              }
              j++;
            }
          }
          i++;
        });
        const tempSales: SaleData[] = [];

        filteredSales.forEach((sale: unknown) => {
          const saleData = sale as object;

          const name = saleData["__EMPTY_6" as keyof typeof saleData] as string;
          const sold = 0;
          // const profit = parseInt(
          //   saleData["__EMPTY_22" as keyof typeof saleData]
          // ) as number;

          const isInList = tempSales.find((sale) => sale.name === name);
          if (!isInList) {
            tempSales.push({
              merchantId: values.merchantId,
              name: name,
              quantity: sold,
            } as SaleData);
            // } else {
            //   tempSales.forEach((sale) => {
            //     if (sale.name === name) {
            //       sale.profit = (sale.profit ?? 0) + profit;
            //     }
            //   });
          }
        });

        tempSales.forEach((sale) => {
          if (sale.quantity !== 0) salesData.push(sale);
        });
      }

      let newProductList: {
        name: string;
        imageUrl: string;
        description: string;
        stockThreshold: number;
        stock: number;
      }[] = [];

      try {
        salesData.forEach((sale) => {
          const product = productStore.products.find(
            (product) => product.name.toLowerCase() === sale.name.toLowerCase()
          );

          if (!product) {
            // if (sale.profit !== 0) {
            const newProduct = {
              name: sale.name,
              imageUrl: "/uploads/default.jpg",
              description: "",
              stockThreshold: 0,
              stock: 0,
            };

            newProductList.push(newProduct);
            // }
          }
        });

        if (newProductList.length > 0) {
          const formData = new FormData();
          formData.append("products", JSON.stringify(newProductList));
          formData.append("type", "bulk");

          await axios.post(`/api/${params.storeId}/products`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        const response = await axios.get(`/api/${params.storeId}/products`);

        const newSalesList: {
          merchantId: string;
          productId: string;
          quantity: number;
        }[] = [];

        salesData.forEach((sale) => {
          const product = (response.data as Product[]).find(
            (myProduct: Product) =>
              myProduct.name.toLowerCase() === sale.name.toLowerCase()
          );

          if (product) {
            // if (sale.profit !== 0) {
            const newSale = {
              merchantId: values.merchantId,
              productId: product.id,
              quantity: sale.quantity,
            };

            newSalesList.push(newSale);
            // }
          }
        });

        await axios.post(`/api/${params.storeId}/sales`, {
          sales: newSalesList,
          type: "bulk",
        });

        toast.success("Sales imported successfully");
        window.location.assign(`/${params.storeId}/sales`);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <section className="mx-auto my-8 w-1/2 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <div className="flex gap-2 items-center">
          <FileSpreadsheet className="w-8 h-8" />
          <h2 className="font-semibold text-xl">Import Penjualan dari Excel</h2>
        </div>
      </header>
      <div className="mt-8">
        <FormProvider {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleAddFromExcel)}
          >
            <FormField
              control={form.control}
              name="merchantId"
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
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Upload File Excel</FormLabel>
              {loading ? (
                <Loader2 className="h-12 w-12 animate-spin" />
              ) : (
                <FileUploader
                  handleChange={getFile}
                  name="file"
                  types={["XLS", "XLSX"]}
                />
              )}
            </FormItem>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button type="submit" disabled={loading}>
                {loading ? "Importing Data..." : "Import Data"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default ImportPage;
