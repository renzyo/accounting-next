import { DataTable } from "@/components/ui/data-table";
import { BadgeDollarSign, PackageCheck } from "lucide-react";
import { SalesColumn, SalesColumns } from "./columns";
import prismadb from "@/lib/prisma";
import AddSale from "./add-sale-button";
import ImportSale from "./import-sale";
import SetProduct from "../set-product";
import { Heading } from "@/components/ui/heading";

export default async function Sales({
  params,
}: {
  params: {
    storeId: string;
  };
}) {
  const storeId = params.storeId as string;

  const sales = await prismadb.sales.findMany({
    where: {
      storeId,
    },
    include: {
      product: true,
      merchant: true,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
  });

  const formattedSales: SalesColumn[] = sales.map((sales) => ({
    id: sales.id,
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
          <AddSale />
          <ImportSale />
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
