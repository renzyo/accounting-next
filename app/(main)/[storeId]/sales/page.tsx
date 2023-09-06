import { DataTable } from "@/components/ui/data-table";
import { BadgeDollarSign } from "lucide-react";
import { SalesColumn, SalesColumns } from "./columns";
import prismadb from "@/lib/prisma";
import AddSale from "./add-sale-button";
import ImportSale from "./import-sale";

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

  const formattedSales: SalesColumn[] = sales.map((sales) => ({
    id: sales.id,
    merchant: sales.merchant,
    product: sales.product,
    quantity: sales.quantity.toString(),
  }));

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <div className="flex gap-2 items-center">
          <BadgeDollarSign className="w-8 h-8" />
          <h2 className="font-semibold text-xl">Penjualan Toko</h2>
        </div>
        <div className="flex ml-auto gap-4">
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
