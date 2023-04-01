import { NextRequest, NextFetchEvent, userAgent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("it works! globle middleware");
  console.log(userAgent(req));

  if (req.nextUrl.pathname.startsWith("/chats")) {
    console.log("chats only middleware");
  }
}
