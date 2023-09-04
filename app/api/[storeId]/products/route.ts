import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId as string,
      },
    });

    return new NextResponse(JSON.stringify(products), {
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
      const { name, description, price, stock } = body;

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

      if (!name) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "Please provide a name for your store.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const product = await prismadb.product.create({
        data: {
          storeId: params.storeId,
          name,
          description,
          price,
          stock,
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
    } else if (type === "bulk") {
      const { products } = body;

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

      if (!products) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "Please provide an array of products.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const product = await prismadb.product.createMany({
        data: products.map((product: any) => ({
          storeId: params.storeId,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
        })),
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
