import fs from "fs/promises";
import path from "path";
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
    const body = await req.formData();
    const type = body.get("type") as string;

    if (type === "single") {
      const name = body.get("name") as string;
      const description = body.get("description") as string;
      const stockThreshold = parseInt(body.get("stockThreshold") as string);
      const stock = parseInt(body.get("stock") as string);
      const image: File | null = body.get("image") as unknown as File;
      let imageUrl = "/uploads/default.jpg";

      if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = image.name;
        const fileExtension = fileName.split(".").pop();
        const newFileName = `${Date.now()}.${fileExtension}`;

        await fs.writeFile(
          path.join(process.cwd(), "public", "uploads", newFileName),
          buffer
        );

        imageUrl = `/uploads/${newFileName}`;
      }

      if (!userId) {
        return NextResponse.json(
          {
            status: "error",
            message: "You are not authorized to access this route.",
          },
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
          imageUrl,
          name,
          description,
          stockThreshold,
          stock,
        },
      });

      return NextResponse.json({ success: true, product });
    } else if (type === "bulk") {
      const products = JSON.parse(body.get("products") as string);

      if (!userId) {
        return NextResponse.json(
          {
            status: "error",
            message: "You are not authorized to access this route.",
          },
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!products) {
        return NextResponse.json(
          {
            status: "error",
            message: "Please provide a name for your store.",
          },
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
          stockThreshold: product.stockThreshold,
          stock: product.stock,
        })),
      });

      return NextResponse.json({ success: true, products: product });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
