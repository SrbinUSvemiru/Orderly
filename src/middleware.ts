import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    // Redirect authenticated users away from login page
    if (req.nextUrl.pathname.startsWith("/sign-in") && isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/sign-in", // Redirect unauthorized users to login
    },
  }
);

// Apply middleware only to protected routes
export const config = {
  matcher: ["/"], // Protect all dashboard pages
};
