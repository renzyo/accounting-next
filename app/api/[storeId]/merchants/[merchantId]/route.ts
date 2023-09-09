import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { merchantId: string } }
) {
  try {
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
