"use client";

import {
  Check,
  ChevronsUpDown,
  FileSpreadsheet,
  Loader2,
  LoaderIcon,
} from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import React, { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useProduct } from "@/hooks/use-product";
import axios from "axios";
import { useParams } from "next/navigation";
import { Product } from "@prisma/client";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  merchant: z.string().min(1),
});

const merchants = [
  { label: "Shopee", value: "Shopee" },
  { label: "Tokopedia", value: "Tokopedia" },
  { label: "Lazada", value: "Lazada" },
  { label: "TikTok", value: "TikTok" },
] as const;

type SaleData = {
  name: string;
  quantity: number;
  profit: number;
};

const ImportPage = () => {
  const productStore = useProduct();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant: "",
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
      const filename = selectedFile?.name;
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sales = XLSX.utils.sheet_to_json(sheet);
      const salesData: SaleData[] = [];
      let marketplace = "";

      if (values.merchant === "Lazada") {
        if (!filename?.toLowerCase().includes("lazada")) return;
        let i = 0;
        sales.forEach((sale: unknown) => {
          if (i > 2) {
            const saleData = sale as object;
            let name = "";
            let sold = 0;
            let profit = 0;
            marketplace = "Lazada";

            // loop saleData
            let j = 0;
            for (const [, value] of Object.entries(saleData)) {
              if (j === 0) {
                name = value as string;
              } else if (j === 13) {
                sold = parseInt(value as string);
              } else if (j === 14) {
                profit = parseInt(value);
              }
              j++;
            }

            const tempSale: SaleData = {
              name,
              quantity: sold,
              profit,
            };
            salesData.push(tempSale);
          }
          i++;
        });
      } else if (values.merchant === "Shopee") {
        if (!filename?.toLowerCase().includes("shopee")) return;
        sales.forEach((sale: unknown) => {
          const saleData = sale as object;
          let name = "";
          let sold = 0;
          let profit = 0;
          marketplace = "Shopee";

          for (const [key, value] of Object.entries(saleData)) {
            if (key === "Produk") {
              name = value as string;
            } else if (key === "Total Produk Dibayar") {
              sold = parseInt(value as string);
            } else if (key === "Total Penjualan (Pesanan Dibayar) (IDR)") {
              profit = value;
              profit = parseInt(profit.toString().replace(/\./g, ""));
            }
          }

          const tempSale: SaleData = {
            name,
            quantity: sold,
            profit,
          };
          salesData.push(tempSale);
        });
      } else if (values.merchant === "TikTok") {
        if (!filename?.toLowerCase().includes("tiktok")) return;
        let i = 0;
        sales.forEach((sale: unknown) => {
          if (i > 0) {
            const saleData = sale as object;
            let name = "";
            let sold = 0;
            let profit = 0;
            marketplace = "TikTok";

            // loop saleData
            let j = 0;
            for (const [, value] of Object.entries(saleData)) {
              if (j === 1) {
                name = value as string;
              } else if (j === 4) {
                sold = parseInt(value as string);
              } else if (j === 2) {
                profit = value;
                profit = parseInt(
                  profit.toString().replace("Rp", "").replace(/\./g, "")
                );
              }
              j++;
            }

            const tempSale: SaleData = {
              name,
              quantity: sold,
              profit,
            };
            salesData.push(tempSale);
          }
          i++;
        });
      } else if (values.merchant === "Tokopedia") {
        if (!filename?.toLowerCase().includes("tokped")) return;
        const filteredSales: object[] = [];
        marketplace = "Tokopedia";
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
          const profit = parseInt(
            saleData["__EMPTY_22" as keyof typeof saleData]
          ) as number;

          const isInList = tempSales.find((sale) => sale.name === name);
          if (!isInList) {
            tempSales.push({
              name: name,
              quantity: sold,
              profit: profit,
            } as SaleData);
          } else {
            tempSales.forEach((sale) => {
              if (sale.name === name) {
                sale.profit = (sale.profit ?? 0) + profit;
              }
            });
          }
        });

        tempSales.forEach((sale) => {
          salesData.push(sale);
        });
      }

      let newProductList: {
        name: string;
        description: string;
        price: number;
        stock: number;
      }[] = [];

      try {
        salesData.forEach((sale) => {
          const product = productStore.products.find(
            (product) => product.name.toLowerCase() === sale.name.toLowerCase()
          );

          if (!product) {
            if (sale.profit !== 0) {
              const newProduct = {
                name: sale.name,
                description: "",
                price: 0,
                stock: 0,
              };

              newProductList.push(newProduct);
            }
          }
        });

        if (newProductList.length > 0) {
          await axios.post(`/api/${params.storeId}/products`, {
            products: newProductList,
            type: "bulk",
          });
        }

        const response = await axios.get(`/api/${params.storeId}/products`);

        const newSalesList: {
          merchant: string;
          productId: string;
          quantity: number;
          profit: number;
        }[] = [];

        salesData.forEach((sale) => {
          console.log(response.data);
          const product = (response.data as Product[]).find(
            (myProduct: Product) =>
              myProduct.name.toLowerCase() === sale.name.toLowerCase()
          );

          if (product) {
            if (sale.profit !== 0) {
              const newSale = {
                merchant: values.merchant,
                productId: product.id,
                quantity: sale.quantity,
                profit: sale.profit,
              };

              newSalesList.push(newSale);
            }
          }
        });

        await axios.post(`/api/${params.storeId}/sales`, {
          sales: newSalesList,
          type: "bulk",
        });

        toast.success("Sales imported successfully");
        window.location.assign(`/${params.storeId}/sales`);
      } catch (error) {
        console.log(error);
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
              name="merchant"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Merchant</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={loading}
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
