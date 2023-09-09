import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId as string;

    const body = await req.json();
    const { name } = body;

    const store = await prismadb.store.update({
      where: {
        id: storeId,
      },
      data: {
        name: name,
      },
    });

    return SuccessResponse(store);
  } catch (error: any) {
    return GlobalError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId as string;

    await prismadb.store.delete({
      where: {
        id: storeId,
      },
    });

    return SuccessResponse({
      status: "success",
      message: "Store deleted successfully.",
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}
