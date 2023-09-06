import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { merchantId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    const merchant = await prismadb.merchant.update({
      where: {
        id: params.merchantId,
      },
      data: {
        name,
      },
    });

    return new NextResponse(JSON.stringify(merchant), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { merchantId: string } }
) {
  try {
    const merchant = await prismadb.merchant.delete({
      where: {
        id: params.merchantId,
      },
    });

    return new NextResponse(JSON.stringify(merchant), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
