import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { GlobalError, SuccessResponse } from "@/lib/helper";

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const formData = await req.formData();
    const previousImageId = formData.get("previousImageId") as string;
    const previousImageUrl = formData.get("previousImageUrl") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const stockThreshold = parseInt(formData.get("stockThreshold") as string);
    const stock = parseInt(formData.get("stock") as string);
    const image: File | null = formData.get("image") as unknown as File;

    let imageId = "";
    let imageUrl = "";

    if (image !== null) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = image.name;
      const fileExtension = fileName.split(".").pop();
      const newFileName = `${Date.now()}.${fileExtension}`;

      const fileRef = ref(storage, `products/${newFileName}`);
      await uploadBytes(fileRef, buffer);

      const url = await getDownloadURL(fileRef);

      imageId = newFileName;
      imageUrl = url;
    } else {
      imageId = previousImageId;
      imageUrl = previousImageUrl;
    }

    if (imageId !== previousImageId) {
      if (previousImageId !== "default") {
        const fileRef = ref(storage, `products/${previousImageId}`);
        await deleteObject(fileRef);
      }
    } else {
      imageUrl = previousImageUrl;
    }

    const product = await prismadb.product.update({
      where: {
        id: params.productId as string,
      },
      data: {
        imageId,
        imageUrl,
        name,
        description,
        stockThreshold,
        stock,
      },
    });

    return SuccessResponse({
      status: "success",
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId as string,
      },
    });

    await prismadb.product.delete({
      where: {
        id: params.productId as string,
      },
    });

    if (product?.imageId && product?.imageId !== "default") {
      const fileRef = ref(storage, `products/${product.imageId}`);
      await deleteObject(fileRef);
    }

    return SuccessResponse({
      status: "success",
      message: "Product deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);
    return GlobalError(error);
  }
}
