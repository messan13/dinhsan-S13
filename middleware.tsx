import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(req:NextRequest){
  const token = await getToken({
    req,
    secret:process.env.NEXTAUTH_SECRET,
  })
  const { pathname } = req.nextUrl
  
  if(pathname.startsWith('/api/auth') || pathname.startsWith('/auth/SignIn') || pathname==='/' ||  pathname.startsWith('/upload') || pathname.startsWith('/api/product') ){
    return NextResponse.next();
  }
  if(!token){
    const url = req.nextUrl.clone();
    url.pathname='auth/SignIn'
    url.searchParams.set('errors','unauthorized')
    return NextResponse.redirect(url);
  }
if(pathname.startsWith('/admin')){
 if(token.checkAdmin === false){
  const url = req.nextUrl.clone();
  url.pathname='auth/SignIn'
  url.searchParams.set('errors','forbidden')
  return NextResponse.redirect(url);
 }
}
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|fonts|images|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
