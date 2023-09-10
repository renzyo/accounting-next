import { GlobalError, SuccessResponse, UnauthorizedError } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string; salesId: string } }
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
    const { merchantId, productId, saleDate, quantity, previousQuantity } =
      body;

    const oldProduct = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: oldProduct?.stock! + previousQuantity,
      },
    });

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: product?.stock! - quantity,
      },
    });

    const sales = await prismadb.sales.update({
      where: {
        id: params.salesId as string,
      },
      data: {
        merchantId,
        productId,
        saleDate,
        quantity,
      },
    });

    return SuccessResponse(sales);
  } catch (error: any) {
    console.log(error);
    return GlobalError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string; salesId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !userId ||
      user?.role !== "ADMIN" &&
      user?.role !== "SALES_MANAGER"
    ) {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

    const body = await req.json();
    const { productId, quantity } = body;

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: product?.stock! + quantity,
      },
    });

    await prismadb.sales.delete({
      where: {
        id: params.salesId as string,
      },
    });

    return SuccessResponse({
      status: "success",
      message: "Sales has been deleted.",
    });
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}
