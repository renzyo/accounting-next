import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { GlobalError, SuccessResponse, UnauthorizedError } from "@/lib/helper";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !userId ||
      (user?.role !== "ADMIN" && user?.role !== "PRODUCT_MANAGER")
    ) {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

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
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !userId ||
      (user?.role !== "ADMIN" && user?.role !== "PRODUCT_MANAGER")
    ) {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

    const body = await req.formData();

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
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}
