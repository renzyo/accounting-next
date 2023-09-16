"use client";

import { DataTable } from "@/components/ui/data-table";
import { PackageCheck } from "lucide-react";
import {
  SalesColumn,
  SalesColumns,
  SalesColumnsWithoutAction,
} from "./columns";
import AddSale from "./add-sale-button";
import { Heading } from "@/components/ui/heading";
import { SalesData, UserData } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingIndicator from "@/components/loading-indicator";
import { useSaleModal } from "@/hooks/use-sale-modal";
import { useTranslations } from "next-intl";

export default function Sales({
  params,
}: {
  params: {
    storeId: string;
  };
}) {
  const t = useTranslations("Sales");

  const saleModalStore = useSaleModal();
  const [loading, setLoading] = useState<boolean[]>([true, true]);
  const [formattedSales, setFormattedSales] = useState<SalesColumn[]>([]);
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    async function getSalesData() {
      try {
        const response = await axios.get(`/api/${params.storeId}/sales`);
        const sales = response.data.sales as SalesData[];

        const tempSales: SalesColumn[] = sales.map((sales) => ({
          id: sales.id,
          addedBy: sales.addedBy,
          merchant: {
            id: sales.merchantId,
            name: sales.merchantName,
          },
          product: {
            id: sales.productId,
            name: sales.productName,
          },
          saleDate: new Date(sales.saleDate),
          quantity: sales.quantity.toString(),
        }));

        setFormattedSales(tempSales);
      } catch (error) {
        console.log(error);
        toast.error(t("loadSaleFailed"));
      } finally {
        setLoading((prev) => [false, prev[1]]);
      }
    }

    async function getUserData() {
      try {
        const response = await axios.get("/api/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
        toast.error(t("loadUserFailed"));
      } finally {
        setLoading((prev) => [prev[0], false]);
      }
    }

    if (saleModalStore.saleUpdated) {
      saleModalStore.setSaleUpdated(false);
    }
    getSalesData();
    getUserData();
  }, [params.storeId, saleModalStore, t]);

  if (loading.some((load) => load)) {
    return <LoadingIndicator />;
  }

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <Heading
          icon={<PackageCheck className="w-8 h-8" />}
          title={t("title")}
          description={t("description")}
        />
        <div className="flex ml-auto gap-4">
          {(user?.role === "ADMIN" || user?.role === "SALES_MANAGER") && (
            <AddSale />
          )}
        </div>
      </header>
      <div className="mt-8">
        <DataTable
          columns={
            user?.role === "ADMIN" || user?.role === "SALES_MANAGER"
              ? SalesColumns
              : SalesColumnsWithoutAction
          }
          data={formattedSales}
          searchKey="product"
          placeholder={t("searchPlaceholder")}
        />
      </div>
    </section>
  );
}
