import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const storeId = params.storeId as string;

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

    const stores = await prismadb.store.findMany({
      where: {
        userId: userId as string,
        id: storeId,
      },
    });

    if (!stores) {
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

    return new NextResponse(
      JSON.stringify({
        status: "success",
        products,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
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
