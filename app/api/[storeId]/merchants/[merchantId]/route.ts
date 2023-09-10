import { GlobalError, SuccessResponse, UnauthorizedError } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { merchantId: string } }
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
    const { name } = body;

    const merchant = await prismadb.merchant.update({
      where: {
        id: params.merchantId,
      },
      data: {
        name,
      },
    });

    return SuccessResponse(merchant);
  } catch (error: any) {
    return GlobalError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { merchantId: string } }
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

    const merchant = await prismadb.merchant.delete({
      where: {
        id: params.merchantId,
      },
    });

    return SuccessResponse(merchant);
  } catch (error: any) {
    return GlobalError(error);
  }
}
