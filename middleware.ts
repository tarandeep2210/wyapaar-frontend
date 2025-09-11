import { clerkMiddleware } from "@clerk/nextjs/server";

// For now, make all routes public to avoid build issues
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)'], // This matcher is from Clerk documentation
};
