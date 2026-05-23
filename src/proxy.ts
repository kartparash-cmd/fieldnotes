import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get("fn_admin");
  const expected = process.env.ADMIN_PASSWORD;

  if (!cookie || !expected || cookie.value !== expected) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
