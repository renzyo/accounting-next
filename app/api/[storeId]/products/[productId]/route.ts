import fs from "fs/promises";
import path from "path";
import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const formData = await req.formData();
    const previousImage = formData.get("previousImage") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const stockThreshold = parseInt(formData.get("stockThreshold") as string);
    const stock = parseInt(formData.get("stock") as string);
    const image: File | null = formData.get("image") as unknown as File;

    if (!userId) {
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to access this route.",
        },
        {
          status: 401,
        }
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          status: "error",
          message: "Please provide a name.",
        },
        {
          status: 400,
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
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to access this route.",
        },
        {
          status: 401,
        }
      );
    }

    let imageUrl = "";

    if (image !== null) {
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
    } else {
      imageUrl = previousImage;
    }

    if (imageUrl !== previousImage) {
      if (previousImage !== "/uploads/default.jpg") {
        await fs.unlink(path.join(process.cwd(), "public", previousImage));
      }
    } else {
      imageUrl = previousImage;
    }

    const product = await prismadb.product.update({
      where: {
        id: params.productId as string,
      },
      data: {
        imageUrl,
        name,
        description,
        stockThreshold,
        stock,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;

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
        id: params.productId as string,
      },
    });

    if (product?.imageUrl && product?.imageUrl !== "/uploads/default.jpg") {
      await fs.unlink(
        path.join(process.cwd(), "public", product?.imageUrl as string)
      );
    }

    await prismadb.product.delete({
      where: {
        id: params.productId as string,
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
