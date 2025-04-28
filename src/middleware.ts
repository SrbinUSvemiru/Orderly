import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (req.nextUrl.pathname.startsWith("/sign-in") && isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/sign-up") && isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/sign-in",
    },
  }
);

export const config = {
  matcher: ["/((?!_next|api|sign-in|favicon.ico|static|public).*)"],
};
