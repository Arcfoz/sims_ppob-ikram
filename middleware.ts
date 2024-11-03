import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  email: string;
  exp: number;
}

const protectedRoutes = ["/dashboard", "/topup", "/transaction", "/account"];
const authRoutes = ["/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;

  let isTokenValid = false;
  let userEmail: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = new Date().getTime() / 1000;

      if (decoded.exp > currentTime) {
        isTokenValid = true;
        userEmail = decoded.email;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  if (protectedRoutes.includes(pathname) && !isTokenValid) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("auth_token");
    return response;
  }

  if (authRoutes.includes(pathname) && isTokenValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  if (isTokenValid && userEmail) {
    response.headers.set("X-User-Email", userEmail);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/topup", "/transaction", "/account", "/"]
};