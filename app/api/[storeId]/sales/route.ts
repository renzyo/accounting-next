import { GlobalError, SuccessResponse, UnauthorizedError } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const sales = await prismadb.sales.findMany({
      where: {
        storeId: params.storeId as string,
      },
      include: {
        product: true,
        merchant: true,
        user: true,
      },
    });

    return SuccessResponse({
      sales: sales.map((sale) => ({
        id: sale.id,
        addedBy: sale.user?.name ?? "Deleted User",
        merchantId: sale.merchantId,
        merchantName: sale.merchant?.name ?? "Deleted Merchant",
        productId: sale.productId,
        productName: sale.product?.name ?? "Deleted Product",
        saleDate: sale.saleDate,
        quantity: sale.quantity,
      })),
    });
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId || (user?.role !== "ADMIN" && user?.role !== "SALES_MANAGER")) {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

    const body = await req.json();
    const { merchantId, productId, quantity, saleDate } = body;

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product?.stock! !== 0) {
      if (product?.stock! < quantity) {
        return GlobalError({
          message: "The quantity is greater than the stock.",
          errorCode: 400,
        });
      }

      await prismadb.product.update({
        where: {
          id: productId,
        },
        data: {
          stock: product?.stock! - quantity,
        },
      });
    }

    const sales = await prismadb.sales.create({
      data: {
        storeId: params.storeId,
        merchantId,
        userId,
        productId: productId,
        saleDate: saleDate,
        quantity,
      },
    });

    return SuccessResponse(sales);
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}
