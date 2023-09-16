import { SuccessResponse } from "@/lib/helper";

export async function GET() {
  const response = SuccessResponse({ message: "Logout successful." });

  await Promise.all([
    response.cookies.delete("token"),
    response.cookies.delete("userId"),
    response.cookies.delete("loggedIn"),
  ]);

  return response;
}
