import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { id, name, email, role, password, updatePassword } =
      await req.json();
    let hashedPassword = "";

    if (updatePassword) {
      hashedPassword = await hash(password, 12);
    }

    if (updatePassword) {
      await prismadb.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          role,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } else {
      await prismadb.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }

    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return SuccessResponse({
      message: "Successfully updated user.",
      users,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUserId = req.cookies.get("userId")?.value;
    const { userId } = params;

    await prismadb.user.delete({
      where: {
        id: userId,
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
      message: "Successfully deleted user.",
      currentUser: currentUserId,
      users,
    });
  } catch (error: any) {
    return GlobalError(error);
  }
}
