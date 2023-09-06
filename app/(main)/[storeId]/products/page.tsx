import { DataTable } from "@/components/ui/data-table";
import { Package } from "lucide-react";
import { ProductColumn, ProductColumns } from "./columns";
import prismadb from "@/lib/prisma";
import AddProduct from "./add-product-button";

export default async function Product({
  params,
}: {
  params: {
    storeId: string;
  };
}) {
  const storeId = params.storeId as string;

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
  });

  const formattedProduct: ProductColumn[] = products.map((product) => ({
    id: product.id,
    image: product.imageUrl ?? "",
    name: product.name,
    description: product.description ?? "-",
    stockThreshold: product.stockThreshold.toString(),
    stock: product.stock.toString(),
  }));

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <div className="flex gap-2 items-center">
          <Package className="w-8 h-8" />
          <h2 className="font-semibold text-xl">Produk Toko</h2>
        </div>
        <div className="flex ml-auto">
          <AddProduct products={products} />
        </div>
      </header>
      <div className="mt-8">
        <DataTable
          columns={ProductColumns}
          data={formattedProduct}
          searchKey="name"
          placeholder="Cari Produk..."
        />
      </div>
    </section>
  );
}

