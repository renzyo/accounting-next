import { GlobalError, SuccessResponse } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { hash } from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterUserInput;
    const data = RegisterUserSchema.parse(body);

    const hashedPassword = await hash(data.password, 12);

    const users = await prismadb.user.findMany();

    if (users.length === 0) {
      const user = await prismadb.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });

      return SuccessResponse({
        status: "success",
        message: "Successfully registered.",
        data: {
          user: {
            ...user,
            password: undefined,
          },
        },
      });
    } else {
      return GlobalError({
        message: "You are not allowed to register.",
        errorCode: 400,
      });
    }
  } catch (error: any) {
    return GlobalError(error);
  }
}
