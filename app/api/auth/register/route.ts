import { getErrorResponse } from "@/lib/helper";
import { prismadb } from "@/lib/prisma";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterUserInput;
    const data = RegisterUserSchema.parse(body);

    const hashedPassword = await hash(data.password, 12);

    const user = await prismadb.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: {
          user: { ...user, password: undefined },
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "Validation error", error);
    }

    if (error.code === "P2002") {
      return getErrorResponse(400, "Email already exists", error);
    }

    return getErrorResponse(500, "Internal Server Error", error);
  }
}
