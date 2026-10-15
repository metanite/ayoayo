import { NextRequest, NextResponse } from "next/server";

const LOCATION_SUFFIX = "-tech-repair-shops";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.endsWith(LOCATION_SUFFIX) || pathname.slice(1).includes("/")) {
    return NextResponse.next();
  }

  const locationSlug = pathname.slice(1, -LOCATION_SUFFIX.length);
  if (!locationSlug) return NextResponse.next();

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = `/${locationSlug}`;
  return NextResponse.rewrite(rewrittenUrl);
}

export const config = {
  matcher: ["/:path*"],
};
