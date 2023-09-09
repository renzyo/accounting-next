import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const merchants = await prismadb.merchant.findMany();

    return SuccessResponse(merchants);
  } catch (error: any) {
    return GlobalError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    const merchant = await prismadb.merchant.create({
      data: {
        name,
      },
    });

    return SuccessResponse(merchant);
  } catch (error: any) {
    return GlobalError(error);
  }
}
