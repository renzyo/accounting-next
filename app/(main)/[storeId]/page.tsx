import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";
import Stock from "./(components)/stock/stock";
import Sold from "./(components)/sold/sold";
import Rank from "./(components)/rank/rank";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async () => {
  return (
    <div className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <div className="flex-1 space-y-4">
        <Heading
          icon={<LayoutDashboard className="w-8 h-8" />}
          title="Dashboard"
          description="Ringkasan data toko Anda"
        />
        <Separator />
        <div className="w-full flex items-center justify-center">
          <Tabs
            defaultValue="stock"
            className="w-full flex flex-col items-center"
          >
            <div className="w-full p-2 bg-slate-300 rounded-lg">
              <TabsList className="w-full bg-slate-300 flex gap-4">
                <TabsTrigger value="stock">
                  <p className="text-lg font-semibold">Stok Barang</p>
                </TabsTrigger>
                <TabsTrigger value="sold">
                  <p className="text-lg font-semibold">Stok Terjual</p>
                </TabsTrigger>
                <TabsTrigger value="rank">
                  <p className="text-lg font-semibold">Ranking Produk</p>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="stock" className="w-[100%]">
              <Stock />
            </TabsContent>
            <TabsContent value="sold" className="w-[100%]">
              <Sold />
            </TabsContent>
            <TabsContent value="rank" className="w-[100%]">
              <Rank />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
