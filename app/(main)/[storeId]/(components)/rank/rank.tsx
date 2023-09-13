"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Subheading } from "@/components/ui/subheading";
import axios from "axios";
import { MedalIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface RankingData {
  productId: string;
  productName: string;
  quantity: number;
}

const Rank = () => {
  const params = useParams();

  const [topFive, setTopFive] = useState<RankingData[]>([]);
  const [bottomFive, setBottomFive] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSold = async () => {
      const response = await axios.get(`/api/${params.storeId}/rank`);
      const top = response.data.topFive;
      const botttom = response.data.bottomFive;

      setTopFive(top);
      setBottomFive(botttom);
      setLoading(false);
    };

    getSold();
  }, [params.storeId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="w-full mt-4 p-4 bg-slate-300 rounded-lg">
      <Subheading
        icon={<MedalIcon className="w-8 h-8" />}
        title="Ranking Produk"
        description="Ranking produk berdasarkan jumlah penjualan bulan ini"
      />
      <div className="mt-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <div className="w-full p-4 bg-slate-100 rounded-lg">
              <Subheading
                title="5 Produk Terlaris"
                description="Produk dengan penjualan terbanyak"
                icon
              />
            </div>
            <div className="mt-4">
              <ul className="w-full">
                {topFive.length ? (
                  topFive.map((product) => (
                    <li
                      key={product.productId}
                      className="flex items-center justify-between p-4 bg-slate-100 rounded-lg mb-2"
                    >
                      <p className="text-lg font-semibold">
                        {product.productName}
                      </p>
                      <p className="text-lg font-semibold">
                        {product.quantity} pcs
                      </p>
                    </li>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center p-4">
                    <p className="text-lg font-semibold">Tidak ada produk</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-full p-4 bg-slate-100 rounded-lg">
              <Subheading
                title="5 Produk Kurang Menarik"
                description="Produk dengan penjualan terendah"
                icon
              />
            </div>
            <div className="mt-4">
              <ul className="w-full">
                {bottomFive.length ? (
                  bottomFive.map((product) => (
                    <li
                      key={product.productId}
                      className="flex items-center justify-between p-4 bg-slate-100 rounded-lg mb-2"
                    >
                      <p className="text-lg font-semibold">
                        {product.productName}
                      </p>
                      <p className="text-lg font-semibold">
                        {product.quantity} pcs
                      </p>
                    </li>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center p-4">
                    <p className="text-lg font-semibold">Tidak ada produk</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rank;
