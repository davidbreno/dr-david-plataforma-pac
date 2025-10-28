export function proxy(request: NextRequest) {
  // Proxy logic goes here
}
export const config = {
  matcher: [
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|site.webmanifest|auth|assets).*)",
  ],
};
