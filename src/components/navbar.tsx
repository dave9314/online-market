"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, LogOut, Menu, X, Moon, Sun, Package } from "lucide-react"
import { useState } from "react"
import { useTheme } from "./theme-provider"

// Prefetch links on hover for faster navigation
const PrefetchLink = ({ href, children, className, ...props }: any) => (
  <Link href={href} prefetch={true} className={className} {...props}>
    {children}
  </Link>
)

export function Navbar() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 sticky top-0 z-50 transition-colors backdrop-blur-sm bg-white/95 dark:bg-gray-950/95 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <PrefetchLink href="/dashboard" className="flex items-center space-x-1.5 group">
            <div className="p-1.5 bg-gray-900 dark:bg-white rounded-lg group-hover:bg-gray-800 dark:group-hover:bg-gray-100 transition-colors">
              <ShoppingBag className="h-4 w-4 text-white dark:text-black" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Marketplace</span>
          </PrefetchLink>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  router.push(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`)
                }
              }}
              className="relative w-full"
            >
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {session?.user && (
              <>
                <PrefetchLink href="/top-rated">
                  <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all duration-150">
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Top Rated</span>
                  </button>
                </PrefetchLink>
                
                <PrefetchLink href="/my-items">
                  <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-all duration-150">
                    <Package className="h-3.5 w-3.5" />
                    <span>My Items</span>
                  </button>
                </PrefetchLink>
                
                {session.user.role === "ADMIN" && (
                  <PrefetchLink href="/admin">
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-all duration-150">
                      Admin
                    </button>
                  </PrefetchLink>
                )}
                
                <button
                  onClick={toggleTheme}
                  className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-all duration-150"
                  title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                  {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </button>

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>
                
                <PrefetchLink href="/profile">
                  <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-all duration-150">
                    {session.user.name}
                  </button>
                </PrefetchLink>
                
                <button
                  onClick={async () => {
                    // Show signout page first, then complete logout
                    router.push("/signout")
                    await signOut({ callbackUrl: "/", redirect: false })
                    setTimeout(() => {
                      router.push("/")
                    }, 1500)
                  }}
                  className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && session?.user && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-200 dark:border-gray-800">
            <Link href="/my-items" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors">
              My Items
            </Link>
            {session.user.role === "ADMIN" && (
              <Link href="/admin" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors">
                Admin
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
              {session.user.name}
            </div>
            <button
              onClick={async () => {
                // Show signout page first, then complete logout
                router.push("/signout")
                await signOut({ callbackUrl: "/", redirect: false })
                setTimeout(() => {
                  router.push("/")
                }, 1500)
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
