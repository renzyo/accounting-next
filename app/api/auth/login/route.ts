import { getErrorResponse } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/token";
import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginUserInput;
    const data = LoginUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !(await compare(data.password, user.password))) {
      return getErrorResponse(401, "Invalid email or password");
    }

    const jwtExpiresIn = process.env.JWT_EXPIRES_IN!;

    const token = await signJWT(
      { sub: user.id },
      { expiresIn: `${jwtExpiresIn}d` }
    );

    const tokenMaxAge = parseInt(jwtExpiresIn) * 24 * 60 * 60;
    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenMaxAge,
    };

    const response = new NextResponse(
      JSON.stringify({
        status: "success",
        token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await Promise.all([
      response.cookies.set(cookieOptions),
      response.cookies.set({
        name: "loggedIn",
        value: "true",
        maxAge: tokenMaxAge,
      }),
    ]);

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "Validation error", error);
    }

    return getErrorResponse(500, "Internal Server Error", error.message);
  }
}
