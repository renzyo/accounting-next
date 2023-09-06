import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string; salesId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const body = await req.json();
    const { merchantId, productId, quantity } = body;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "You are not authorized to access this route.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId as string,
        userId: userId as string,
      },
    });

    if (!store) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "You are not authorized to access this route.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const product = await prismadb.sales.update({
      where: {
        id: params.salesId as string,
      },
      data: {
        merchantId,
        productId,
        quantity,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: product,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {}
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string; salesId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const body = await req.json();
    const { productId, quantity } = body;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "You are not authorized to access this route.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId as string,
        userId: userId as string,
      },
    });

    if (!store) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "You are not authorized to access this route.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

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

    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Store deleted successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
