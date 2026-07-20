import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Storefront is public by default. Only buyer/seller dashboards and the
// onboarding flow require an authenticated (and eventually onboarded) user.
const isProtectedRoute = createRouteMatcher([
  "/buyer(.*)",
  "/seller(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
