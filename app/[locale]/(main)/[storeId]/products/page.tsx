"use client";

import { DataTable } from "@/components/ui/data-table";
import { Package } from "lucide-react";
import AddProduct from "./add-product-button";
import { Heading } from "@/components/ui/heading";
import {
  ProductColumn,
  ProductColumns,
  ProductColumnsWithoutAction,
} from "./columns";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ProductData, UserData } from "@/lib/types";
import { useProduct } from "@/hooks/use-product";
import LoadingIndicator from "@/components/loading-indicator";
import { useTranslations } from "next-intl";

export default function Product({
  params,
}: {
  params: {
    storeId: string;
  };
}) {
  const t = useTranslations("Products");
  const productStore = useProduct();

  const [loading, setLoading] = useState<boolean[]>([true, true]);
  const [user, setUser] = useState<UserData>();
  const [formattedProduct, setFormattedProduct] = useState<ProductColumn[]>([]);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get(`/api/${params.storeId}/products`);
        const products = response.data.products as ProductData[];

        const tempProducts: ProductColumn[] = products.map((product) => ({
          id: product.id,
          imageId: product.imageId ?? "",
          image: product.imageUrl ?? "",
          name: product.name,
          description: product.description ?? "-",
          stockThreshold: product.stockThreshold.toString(),
          stock: product.stock.toString(),
        }));

        setFormattedProduct(tempProducts);
      } catch (error) {
        console.log(error);
        toast.error(t("loadProductFailed"));
      } finally {
        setLoading((prev: any) => [false, prev[1]]);
      }
    }

    async function getUserData() {
      try {
        const response = await axios.get("/api/auth/profile");
        const user = response.data.user as UserData;

        setUser(user);
      } catch (error) {
        console.log(error);
        toast.error(t("loadUserFailed"));
      } finally {
        setLoading((prev) => [prev[0], false]);
      }
    }

    if (productStore.productUpdated) {
      productStore.setProductUpdated(false);
    }
    getProducts();
    getUserData();
  }, [params.storeId, productStore, t]);

  if (loading.some((load) => load)) {
    return <LoadingIndicator />;
  }

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <Heading
          icon={<Package className="w-8 h-8" />}
          title={t("title")}
          description={t("description")}
        />
        <div className="flex ml-auto">
          {(user?.role === "ADMIN" || user?.role === "PRODUCT_MANAGER") && (
            <AddProduct />
          )}
        </div>
      </header>
      <div className="mt-8">
        <DataTable
          columns={
            user?.role === "ADMIN" || user?.role === "PRODUCT_MANAGER"
              ? ProductColumns
              : ProductColumnsWithoutAction
          }
          data={formattedProduct}
          searchKey="name"
          placeholder={t("searchPlaceholder")}
        />
      </div>
    </section>
  );
}
