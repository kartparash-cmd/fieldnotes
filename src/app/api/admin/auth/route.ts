import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  if (!body?.password || body.password !== expected) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "fn_admin",
    value: expected,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
