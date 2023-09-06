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

      const product = await prismadb.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (product?.stock! !== 0) {
        if (product?.stock! < quantity) {
          return new NextResponse(
            JSON.stringify({
              status: "error",
              message: "You do not have enough stock.",
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
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
          productId: productId,
          quantity,
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
              merchantId: sale.merchantId,
              productId: sale.productId,
              quantity: sale.quantity,
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
