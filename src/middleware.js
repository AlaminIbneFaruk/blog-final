import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // By default, all routes are protected.
  // We make the following routes public so they can be accessed without authentication.
  publicRoutes: [
    '/', 
    '/posts', 
    '/api/posts' // Allows GET requests for posts to be public.
  ]
});

export const config = {
  // The following routes are protected by the middleware
  matcher: [
    '/((?!_next/image|_next/static|favicon.ico|.*\\..*).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}; 