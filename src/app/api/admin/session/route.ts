import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin";
import { getAuthorizedSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { accessToken?: string } | null;
  if (!body?.accessToken)
    return NextResponse.json({ error: "Missing access token." }, { status: 400 });

  const client = getAuthorizedSupabaseClient(body.accessToken);
  if (!client) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser(body.accessToken);
  if (userError || !user?.email)
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  const { data: admin, error } = await client
    .from("admin_users")
    .select("id")
    .eq("email", user.email.toLowerCase())
    .eq("is_active", true)
    .maybeSingle();
  if (error || !admin)
    return NextResponse.json({ error: "Admin access is not enabled." }, { status: 403 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, body.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
