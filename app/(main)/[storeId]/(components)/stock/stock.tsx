"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StockColumn, StockColumns } from "./columns";
import { StockDataTable } from "./data-table";
import { PackageXIcon } from "lucide-react";
import { Subheading } from "@/components/ui/subheading";
import LoadingIndicator from "@/components/loading-indicator";

const Stock = () => {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<StockColumn[]>([]);

  useEffect(() => {
    const getStocks = async () => {
      const response = await axios.get(`/api/${params.storeId}/stocks`);
      const data = response.data.products as StockColumn[];

      setStocks(data);
      setLoading(false);
    };

    getStocks();

    const interval = setInterval(() => {
      getStocks();
    }, 5000);

    return () => clearInterval(interval);
  }, [params.storeId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="w-full mt-4 p-4 bg-slate-300 rounded-lg">
      <Subheading
        icon={<PackageXIcon className="w-8 h-8" />}
        title="Stok Barang"
        description="Daftar stok barang yang berada dibawah batas stok"
      />
      <div className="mt-4">
        {stocks.length > 0 ? (
          <StockDataTable
            columns={StockColumns}
            data={stocks}
            searchKey="name"
            placeholder="Cari Produk..."
          />
        ) : (
          <div className="flex items-center justify-center p-16">
            <p className="text-gray-500">
              Tidak ada stok barang yang dibawah batas stok
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
