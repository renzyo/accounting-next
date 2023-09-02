import { getErrorResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");

  if (!userId) {
    return getErrorResponse(
      401,
      "You are not authorized to access this route."
    );
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
  });

  return NextResponse.json({
    status: "success",
    data: {
      ...user,
      password: undefined,
    },
  });
}
