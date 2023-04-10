import {
  NextRequest,
  NextResponse,
  NextFetchEvent,
  userAgent,
} from "next/server";

// export const config = { matcher: ["/((?!_next|api/auth).*)(.+)"] };

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (userAgent(req).isBot) {
    return new Response("Plz don't be a bot. Be human", { status: 403 });
  }

  if (req.nextUrl.pathname.startsWith("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.get("carrotsession")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/chats")) {
  }
}
