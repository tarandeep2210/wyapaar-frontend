import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/user(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      // Redirect to sign-in if not authenticated
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)'], // This matcher is from Clerk documentation
};
