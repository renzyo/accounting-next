import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    return SuccessResponse({
      user: {
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}
