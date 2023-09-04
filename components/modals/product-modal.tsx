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
  price: z.string().min(1),
  stock: z.string().min(1),
});

export const ProductModal = () => {
  const productStore = useProductModal();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: productStore.isEditing
      ? productStore.productData
      : {
          name: "",
          description: "",
          price: "",
          stock: "",
        },
  });

  useEffect(() => {
    if (productStore.isEditing) {
      const price = productStore.productData?.price
        .replace(".", "")
        .replace(",00", "")
        .replace("Rp ", "");
      form.setValue("name", productStore.productData?.name ?? "");
      form.setValue("description", productStore.productData?.description ?? "");
      form.setValue("price", price ?? "");
      form.setValue("stock", productStore.productData?.stock ?? "");
    }
  }, [productStore.isEditing, productStore.productData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitted");
    try {
      setLoading(true);
      const product = {
        name: values.name,
        description: values.description,
        price: parseInt(values.price),
        stock: parseInt(values.stock),
      };

      if (productStore.isEditing) {
        await axios.put(
          `/api/${params.storeId}/products/${productStore.productData?.id}`,
          product
        );
        toast.success("Produk berhasil diperbaharui");
        productStore.setIsEditing(false);
      } else {
        await axios.post(`/api/${params.storeId}/products`, {
          ...product,
          type: "single",
        });
        toast.success("Produk berhasil ditambahkan");
      }

      productStore.onClose();
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Produk</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Harga Produk"
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
                      <FormLabel>Stok Produk</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Stok Produk"
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
