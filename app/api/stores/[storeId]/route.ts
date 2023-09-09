import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId as string;

    const body = await req.json();
    const { name } = body;

    const store = await prismadb.store.update({
      where: {
        id: storeId,
      },
      data: {
        name: name,
      },
    });

    return new NextResponse(JSON.stringify(store), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
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
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId as string;

    await prismadb.store.delete({
      where: {
        id: storeId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Store has been deleted.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
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
