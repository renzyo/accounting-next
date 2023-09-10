import { DataTable } from "@/components/ui/data-table";
import { Package } from "lucide-react";
import prismadb from "@/lib/prisma";
import AddProduct from "./add-product-button";
import SetProduct from "@/app/(main)/[storeId]/set-product";
import { Heading } from "@/components/ui/heading";
import {
  ProductColumn,
  ProductColumns,
  ProductColumnsWithoutAction,
} from "./columns";
import { cookies } from "next/headers";

export default async function Product({
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

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
  });

  const formattedProduct: ProductColumn[] = products.map((product) => ({
    id: product.id,
    imageId: product.imageId ?? "",
    image: product.imageUrl ?? "",
    name: product.name,
    description: product.description ?? "-",
    stockThreshold: product.stockThreshold.toString(),
    stock: product.stock.toString(),
  }));

  return (
    <section className="mx-auto my-8 w-4/5 p-8 bg-slate-50 shadow-lg rounded-lg">
      <header className="flex flex-col md:flex-row items-center">
        <Heading
          icon={<Package className="w-8 h-8" />}
          title="Produk Toko"
          description="Produk yang terdapat pada toko anda"
        />
        <div className="flex ml-auto">
          <SetProduct products={products} />
          {(user?.role === "ADMIN" || user?.role === "PRODUCT_MANAGER") && (
            <AddProduct products={products} />
          )}
        </div>
      </header>
      <div className="mt-8">
        <DataTable
          columns={
            user?.role === "ADMIN" || user?.role === "PRODUCT_MANAGER"
              ? ProductColumns
              : ProductColumnsWithoutAction
          }
          data={formattedProduct}
          searchKey="name"
          placeholder="Cari Produk..."
        />
      </div>
    </section>
  );
}

