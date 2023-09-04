import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

    return new NextResponse(JSON.stringify(sales), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const body = await req.json();
    const { type } = body;

    if (type === "single") {
      const { merchant, productId, quantity, profit } = body;

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

      const sales = await prismadb.sales.create({
        data: {
          storeId: params.storeId,
          merchant,
          productId: productId,
          quantity,
          profit,
        },
      });

      return new NextResponse(
        JSON.stringify({
          status: "success",
          data: sales,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else if (type === "bulk") {
      const { sales } = body;

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

      const salesData = await Promise.all(
        sales.map((sale: any) => {
          return prismadb.sales.create({
            data: {
              storeId: params.storeId,
              merchant: sale.merchant,
              productId: sale.productId,
              quantity: sale.quantity,
              profit: sale.profit,
            },
          });
        })
      );

      return new NextResponse(
        JSON.stringify({
          status: "success",
          data: salesData,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
