import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { Overview } from "@/components/overview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prisma";
import {
  AlertOctagon,
  AlertOctagonIcon,
  AlertTriangle,
  AlertTriangleIcon,
  CheckCircle,
  CreditCard,
  Package,
} from "lucide-react";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const graphRevenue = await getGraphRevenue(params.storeId);

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const isProductStockLow = products.some(
    (product) => product.stock <= product.stockThreshold
  );

  return (
    <div className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <div className="flex-1 space-y-4">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-3/5">
            <div className="grid gap-4 grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{"123"}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Products In Stock
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{"123"}</div>
                </CardContent>
              </Card>
            </div>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphRevenue} />
              </CardContent>
            </Card>
          </div>
          <div className="w-2/5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Notifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                {isProductStockLow ? (
                  products.map((product) => {
                    if (product.stock <= product.stockThreshold) {
                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 border-2 p-4 bg-red-200 rounded-lg border-red-200"
                        >
                          <AlertOctagonIcon className="w-6 h-6 text-red-500" />
                          <div className="flex flex-col">
                            <div className="text-lg">
                              Produk {product.name} hampir habis.
                            </div>
                            <div className="text-sm">
                              Produk {product.name} tersisa {product.stock}{" "}
                              buah.
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })
                ) : (
                  <div className="flex items-center gap-4 border-2 p-4 bg-green-200 rounded-lg border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div className="flex flex-col">
                      <div className="text-lg">Semua produk tersedia.</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
