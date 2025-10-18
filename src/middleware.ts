import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Extract subdomain from hostname
  let subdomain: string | null = null;
  let environment: string | null = null;

  // Parse subdomain
  if (hostname.includes(".")) {
    const parts = hostname.split(".");

    // Handle different scenarios:
    // 1. chatbot1.localhost:3001 → ['chatbot1', 'localhost:3001']
    // 2. chatbot1.chatelio.com → ['chatbot1', 'chatelio', 'com']
    // 3. dev.chatbot1.chatelio.com → ['dev', 'chatbot1', 'chatelio', 'com']
    // 4. chatbot1.dev.localhost:3001 → ['chatbot1', 'dev', 'localhost:3001']

    if (parts.length >= 2) {
      const domainPart = parts[parts.length - 1].split(":")[0]; // Last part without port
      const secondLastPart = parts[parts.length - 2]?.split(":")[0];

      // Check if this is localhost or a real domain
      const isLocalhost =
        domainPart === "localhost" || secondLastPart === "localhost";

      if (isLocalhost) {
        // Development: chatbot1.localhost or chatbot1.dev.localhost
        if (parts.length === 2) {
          // chatbot1.localhost
          subdomain = parts[0].split(":")[0];
        } else if (parts.length === 3) {
          // chatbot1.dev.localhost or dev.chatbot1.localhost
          const first = parts[0].split(":")[0];
          const second = parts[1].split(":")[0];

          // Check if first part is environment
          if (["dev", "staging", "local"].includes(first)) {
            environment = first;
            subdomain = second;
          } else {
            subdomain = first;
            environment = second;
          }
        }
      } else {
        // Production: chatbot1.chatelio.com or dev.chatbot1.chatelio.com
        if (parts.length === 3) {
          // chatbot1.chatelio.com
          subdomain = parts[0].split(":")[0];
        } else if (parts.length === 4) {
          // dev.chatbot1.chatelio.com
          environment = parts[0].split(":")[0];
          subdomain = parts[1].split(":")[0];
        }
      }
    }
  }

  // List of reserved subdomains that should NOT be treated as chatbot slugs
  const reservedSubdomains = [
    "www",
    "api",
    "admin",
    "dashboard",
    "app",
    "dev",
    "staging",
    "local",
    "test",
  ];

  // Check if this is a valid chatbot subdomain
  const isChatbotSubdomain =
    subdomain &&
    !reservedSubdomains.includes(subdomain) &&
    subdomain.length >= 3;

  if (isChatbotSubdomain && subdomain) {
    // Rewrite subdomain.domain.com → domain.com/[slug]/chat
    // This allows Next.js to use the existing [slug] route structure
    const url = request.nextUrl.clone();

    // If accessing root of subdomain, redirect to chat page
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = `/${subdomain}/chat`;
      const rewriteResponse = NextResponse.rewrite(url);
      if (environment) {
        rewriteResponse.headers.set("X-Environment", environment);
      }
      rewriteResponse.headers.set("X-Chatbot-Slug", subdomain);
      return rewriteResponse;
    }

    // If accessing a specific path, prepend the subdomain
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      const rewriteResponse = NextResponse.rewrite(url);
      if (environment) {
        rewriteResponse.headers.set("X-Environment", environment);
      }
      rewriteResponse.headers.set("X-Chatbot-Slug", subdomain);
      return rewriteResponse;
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|dashboard|company|settings|profile|users|knowledge-base).*)",
  ],
};
