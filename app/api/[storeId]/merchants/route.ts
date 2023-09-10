import { GlobalError, SuccessResponse, UnauthorizedError } from "@/lib/helper";
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
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId || (user?.role !== "ADMIN" && user?.role !== "SALES_MANAGER")) {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

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
