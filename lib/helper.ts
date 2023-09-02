import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function getErrorResponse(
  status: number = 500,
  message: string = "Internal Server Error",
  errors: ZodError | null = null
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message,
      errors: errors ? errors : null,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
