import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RankingData {
  productId: string;
  productName: string;
  quantity: number;
}

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

    const sales = await prismadb.sales.findMany({
      where: {
        storeId: storeId,
        saleDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        },
      },
      include: {
        product: true,
      },
    });

    const ranking: RankingData[] = [];

    sales.forEach((sale) => {
      const product = ranking.find(
        (product) => product.productId === sale.productId
      );

      if (product) {
        product.quantity += sale.quantity;
      } else {
        ranking.push({
          productId: sale.productId,
          productName: sale.product.name,
          quantity: sale.quantity,
        });
      }
    });

    const sortedRanking = ranking.sort((a, b) => b.quantity - a.quantity);

    let topFive: RankingData[] = [];
    let bottomFive: RankingData[] = [];

    if (sortedRanking.length > 10) {
      topFive = sortedRanking.slice(0, 5);
      bottomFive = sortedRanking.slice(-5);
    } else if (sortedRanking.length > 5) {
      topFive = sortedRanking.slice(0, 5);
      bottomFive = sortedRanking.slice(5 - sortedRanking.length);
    } else {
      topFive = sortedRanking;
    }

    return new NextResponse(
      JSON.stringify({
        status: "success",
        topFive,
        bottomFive,
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
        message: "Something went wrong. Please try again later.",
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
