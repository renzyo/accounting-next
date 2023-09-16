"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Overview } from "@/components/overview";
import { Subheading } from "@/components/ui/subheading";
import axios from "axios";
import { TruckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Sold = () => {
  const t = useTranslations("SoldPage");
  const params = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSold = async () => {
      const response = await axios.get(`/api/${params.storeId}/sold`);
      const data = response.data.data;

      setData(data);
      setLoading(false);
    };

    getSold();

    const interval = setInterval(() => {
      getSold();
    }, 5000);

    return () => clearInterval(interval);
  }, [params.storeId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="w-full mt-4 p-4 bg-slate-300 rounded-lg">
      <Subheading
        icon={<TruckIcon className="w-8 h-8" />}
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-8">
        <Overview data={data} />
      </div>
    </div>
  );
};

export default Sold;
