import { SuccessResponse } from "@/lib/helper";

export async function GET() {
  const response = SuccessResponse({ message: "Logout successful." });

  await Promise.all([
    response.cookies.set({
      name: "token",
      value: "",
      maxAge: -1,
    }),
    response.cookies.set({
      name: "loggedIn",
      value: "",
      maxAge: -1,
    }),
    response.cookies.set({
      name: "userId",
      value: "",
      maxAge: -1,
    }),
  ]);

  return response;
}
