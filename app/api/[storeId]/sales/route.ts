import { GlobalError, SuccessResponse } from "@/lib/helper";
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
    });

    return SuccessResponse(sales);
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
    const userId = req.headers.get("x-user-id")!;
    const body = await req.json();
    const { type } = body;

    if (type === "single") {
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
    } else if (type === "bulk") {
      const { sales } = body;

      const salesData = await Promise.all(
        sales.map((sale: any) => {
          return prismadb.sales.create({
            data: {
              storeId: params.storeId,
              userId,
              merchantId: sale.merchantId,
              productId: sale.productId,
              saleDate: new Date(),
              quantity: sale.quantity,
            },
          });
        })
      );

      return SuccessResponse(salesData);
    }
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}
