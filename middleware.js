import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the routes that REQUIRE authentication
const isProtectedRoute = createRouteMatcher([
    "/cars",
    "/admin(.*)",
    "/saved-cars(.*)",
    "/reservation(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    // 1. Check if the current route is protected
    if (isProtectedRoute(req)) {
        // 2. Extract the userId synchronously
        const { userId } = await auth();
        
        // 3. If userId is missing, return the result of calling the redirect method directly.
        if (!userId) {
            // NOTE: We rely on the auth function itself to handle the redirect
            // when it returns the result of the redirection call.
            return auth.redirectToSignIn(); // Use the function form
        }
    }
});

export const config = {
    matcher: [
        '/((?!.+\\.[\\w]+$|_next).*)',
        '/',
        '/(api|trpc)(.*)',
    ],
};
