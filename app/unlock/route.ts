import { NextResponse, type NextRequest } from "next/server";

// Gizli giriş URL'i: /unlock?key=PREVIEW_KEY
// Cookie set eder ve /auth/login'e yönlendirir.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key || key !== process.env.PREVIEW_KEY) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.redirect(new URL("/auth/login", request.url));
  response.cookies.set("iyibiri_preview", key, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 gün
    path: "/",
  });
  return response;
}
