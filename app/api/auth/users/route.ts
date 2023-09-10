import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;

    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return SuccessResponse({
      currentUser: userId,
      users,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const { name, email, role, password, confirmPassword } = await req.json();

    if (password !== confirmPassword) {
      return GlobalError({
        message: "Password and Confirm Password does not match",
        errorCode: 400,
      });
    }

    const hashedPassword = await hash(password, 12);

    await prismadb.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return SuccessResponse({
      message: "Successfully created user.",
      currentUser: userId,
      users,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}
