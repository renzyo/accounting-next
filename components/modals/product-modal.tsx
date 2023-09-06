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
import { useProductModal } from "@/hooks/use-product-modal";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  stockThreshold: z.string().min(1),
  stock: z.string().min(1),
});

export const ProductModal = () => {
  const productStore = useProductModal();
  const params = useParams();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: productStore.isEditing
      ? productStore.productData
      : {
          name: "",
          description: "",
          stockThreshold: "",
          stock: "",
        },
  });

  useEffect(() => {
    if (productStore.isEditing) {
      form.setValue("name", productStore.productData?.name ?? "");
      form.setValue("description", productStore.productData?.description ?? "");
      form.setValue(
        "stockThreshold",
        productStore.productData?.stockThreshold ?? ""
      );
      form.setValue("stock", productStore.productData?.stock ?? "");
    }
  }, [productStore.isEditing, productStore.productData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitted");
    try {
      setLoading(true);

      const formData = new FormData();
      if (file) {
        formData.append("image", file as File);
      }
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("stockThreshold", values.stockThreshold);
      formData.append("stock", values.stock);

      console.log(formData);

      if (productStore.isEditing) {
        await axios.put(
          `/api/${params.storeId}/products/${productStore.productData?.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Produk berhasil diperbaharui");
        productStore.setIsEditing(false);
      } else {
        formData.append("type", "single");

        await axios.post(`/api/${params.storeId}/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Produk berhasil ditambahkan");
      }

      router.refresh();
      setFile(null);
      form.reset();
      productStore.onClose();
    } catch (error) {
      toast.error("Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={productStore.isEditing ? "Edit Produk" : "Tambah Produk"}
      description={
        productStore.isEditing
          ? "Perbaharui produk yang sudah ada."
          : "Tambahkan produk baru ke toko."
      }
      isOpen={productStore.isOpen}
      onClose={() => {
        if (productStore.isEditing) {
          productStore.setIsEditing(false);
        }
        form.reset();
        productStore.onClose();
      }}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  defaultValue={productStore.productData?.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Nama Produk"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Gambar Produk</FormLabel>
                  <FormControl>
                    <Input
                      name="image"
                      type="file"
                      accept="image/*"
                      disabled={loading}
                      placeholder="Gambar Produk"
                      onChange={(event: any) => {
                        setFile(event.target.files?.[0] ?? null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Produk</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Deskripsi Produk"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batas Stok</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Batas Stok"
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
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stok</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Stok"
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
                      if (productStore.isEditing) {
                        productStore.setIsEditing(false);
                      }
                      form.reset();
                      productStore.onClose();
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
                    {productStore.isEditing
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
