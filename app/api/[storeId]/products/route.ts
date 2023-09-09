import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { GlobalError, SuccessResponse } from "@/lib/helper";

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

    return SuccessResponse(products);
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.formData();
    const type = body.get("type") as string;

    if (type === "single") {
      const name = body.get("name") as string;
      const description = body.get("description") as string;
      const stockThreshold = parseInt(body.get("stockThreshold") as string);
      const stock = parseInt(body.get("stock") as string);
      const image: File | null = body.get("image") as unknown as File;
      let imageId = "default";
      let imageUrl = "/uploads/default.jpg";

      if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = image.name;
        const fileExtension = fileName.split(".").pop();
        const newFileName = `${Date.now()}.${fileExtension}`;

        const fileRef = ref(storage, `products/${newFileName}`);
        await uploadBytes(fileRef, buffer);

        // getDownloadURL
        const url = await getDownloadURL(fileRef);
        imageId = newFileName;
        imageUrl = url;
      }

      const product = await prismadb.product.create({
        data: {
          storeId: params.storeId,
          imageId,
          imageUrl,
          name,
          description,
          stockThreshold,
          stock,
        },
      });

      return SuccessResponse(product);
    } else if (type === "bulk") {
      const products = JSON.parse(body.get("products") as string);

      if (!products) {
        return GlobalError({
          message: "Products is required.",
          errorCode: 400,
        });
      }

      const product = await prismadb.product.createMany({
        data: products.map((product: any) => ({
          storeId: params.storeId,
          imageId: product.imageId,
          imageUrl: product.imageUrl,
          name: product.name,
          description: product.description,
          stockThreshold: product.stockThreshold,
          stock: product.stock,
        })),
      });

      return SuccessResponse(product);
    }
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}
