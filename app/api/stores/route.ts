import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "You are not authorized to access this route.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!name) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Please provide a name for your store.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId: userId as string,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: store,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {}
}
