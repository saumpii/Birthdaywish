// src/middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This function will run before protected routes
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Allow all access by default
    },
    pages: {
      signIn: '/login'
    }
  }
);

// Only apply middleware to routes that need auth check
export const config = {
  matcher: [
    // Include paths that require authentication
    "/create-room",
    "/api/rooms/invite",
    "/api/notes/(.*)" // Only protect note creation/editing
  ]
};