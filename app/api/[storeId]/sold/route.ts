import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

interface GraphData {
  name: string;
  total: number;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId as string;

    const sales = await prismadb.sales.findMany({
      where: {
        storeId: storeId,
        saleDate: {
          gte: new Date(new Date().getFullYear(), 0, 1),
          lte: new Date(new Date().getFullYear(), 11, 31),
        },
      },
    });

    const monthlyRevenue: { [key: number]: number } = {};

    for (const sale of sales) {
      const month = sale.createdAt.getMonth();
      let revenueForSale = 0;

      revenueForSale += sale.quantity;

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForSale;
    }

    const graphData: GraphData[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return SuccessResponse({
      data: graphData,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}
