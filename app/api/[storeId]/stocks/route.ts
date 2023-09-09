import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId as string;

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        stock: {
          lt: prismadb.product.fields.stockThreshold,
        },
      },
      select: {
        id: true,
        name: true,
        stockThreshold: true,
        stock: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 10,
    });

    return SuccessResponse({
      products,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}
