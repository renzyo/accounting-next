import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return GlobalError({
        message: "Name is required.",
        errorCode: 400,
      });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId: userId as string,
      },
    });

    return SuccessResponse(store);
  } catch (error: any) {
    return GlobalError(error);
  }
}
