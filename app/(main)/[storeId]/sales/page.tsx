import { DataTable } from "@/components/ui/data-table";
import { PackageCheck } from "lucide-react";
import { SalesColumn, SalesColumns } from "./columns";
import prismadb from "@/lib/prisma";
import AddSale from "./add-sale-button";
import SetProduct from "@/app/(main)/[storeId]/set-product";
import { Heading } from "@/components/ui/heading";
import { cookies } from "next/headers";

export default async function Sales({
  params,
}: {
  params: {
    storeId: string;
  };
}) {
  const userId = cookies().get("userId")?.value;

  const user = await prismadb.user.findFirst({
    where: {
      id: userId,
    },
  });

  const storeId = params.storeId as string;

  const sales = await prismadb.sales.findMany({
    where: {
      storeId,
    },
    include: {
      product: true,
      merchant: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
  });

  const formattedSales: SalesColumn[] = sales.map((sales) => ({
    id: sales.id,
    addedBy: sales.user.name ?? "Deleted User",
    merchant: sales.merchant,
    product: sales.product,
    saleDate: sales.saleDate,
    quantity: sales.quantity.toString(),
  }));

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <Heading
          icon={<PackageCheck className="w-8 h-8" />}
          title="Penjualan Toko"
          description="Daftar penjualan yang telah dilakukan"
        />
        <div className="flex ml-auto gap-4">
          <SetProduct products={products} />
          {(user?.role === "ADMIN" || user?.role === "SALES_MANAGER") && (
            <AddSale />
          )}
        </div>
      </header>
      <div className="mt-8">
        <DataTable
          columns={SalesColumns}
          data={formattedSales}
          searchKey="product"
          placeholder="Cari Produk..."
        />
      </div>
    </section>
  );
}
