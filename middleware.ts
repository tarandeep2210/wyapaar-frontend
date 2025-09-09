import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/search", "/categories", "/sign-in", "/sign-up"], // Adjust public routes as needed
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*) 금 (?!/api/auth).*'], // This matcher is from Clerk documentation
};
