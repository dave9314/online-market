export { default } from "next-auth/middleware"

export const config = {
  // Only protect pages that require authentication
  // API routes and view pages (item details, categories) are public
  matcher: [
    "/dashboard/:path*", 
    "/post-item/:path*", 
    "/admin/:path*", 
    "/my-items/:path*", 
    "/edit-item/:path*",
    "/profile/:path*",
    "/top-rated/:path*"
  ],
}
