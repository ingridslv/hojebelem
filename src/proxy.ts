import { auth } from "@/auth"; import { NextResponse } from "next/server";
export default auth((req)=>{const path=req.nextUrl.pathname;if((path.startsWith("/admin")&&req.auth?.user?.role!=="ADMIN")||(path.startsWith("/wishlist")&&!req.auth)){return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`,req.url));}return NextResponse.next();});
export const config={matcher:["/admin/:path*","/wishlist/:path*"]};
