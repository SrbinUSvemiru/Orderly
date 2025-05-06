import { type NextRequest, NextResponse } from "next/server";

import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "./lib/actions/auth";
import { logOut } from "./lib/actions/logOut";

const privateRoutes = ["/", "workflow", "settings", "clients", "inventory"];
const publicRoutes = ["sign-in", "sign-up"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();

  await updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value });
    },
    get: (key) => request.cookies.get(key),
  });

  return response;
}

async function middlewareAuth(request: NextRequest) {
  const rootPath = request.nextUrl.pathname.split("/")[1] || "/";

  if (privateRoutes.includes(rootPath)) {
    const user = await getUserFromSession(request.cookies);
    if (user === null) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (publicRoutes.includes(rootPath)) {
    const user = await getUserFromSession(request.cookies);
    if (user && rootPath === "sign-in") {
      await logOut();
    }
    // if (rootPath === "sign-up") {
    //   const token = request.nextUrl.searchParams.get("token");
    //   const verifiedToken = token ? await verifyToken(token) : null;

    //   if (!verifiedToken?.email) {
    //     return NextResponse.redirect(new URL("/sign-in", request.url));
    //   }
    // }
  }

  if (adminRoutes.includes(request.nextUrl.pathname)) {
    const user = await getUserFromSession(request.cookies);
    if (user === null) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // if (user.role !== "admin") {
    //   return NextResponse.redirect(new URL("/", request.url))
    // }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
