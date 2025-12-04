"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, FolderOpen, ShoppingCart } from "lucide-react"

type Stats = {
  totalUsers: number
  totalItems: number
  totalCategories: number
  usersWithItems: number
  recentUsers: Array<{
    id: string
    username: string
    fullName: string
    createdAt: string
    _count: { items: number }
  }>
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (status === "loading") return
      
      if (status === "unauthenticated") {
        router.push("/")
        return
      }
      
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard")
        return
      }

      try {
        const response = await fetch("/api/admin/stats", {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [status, session, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-gray-900 dark:text-white mb-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monitor and manage marketplace</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Link href="/admin/users" prefetch={true}>
            <Card className="border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-pointer hover:shadow-md transition-all duration-150 active:scale-95">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Users</span>
                </div>
                <div className="text-2xl font-medium text-gray-900 dark:text-white">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to manage</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users" prefetch={true}>
            <Card className="border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-pointer hover:shadow-md transition-all duration-150 active:scale-95">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Sellers</span>
                </div>
                <div className="text-2xl font-medium text-gray-900 dark:text-white">{stats?.usersWithItems || 0}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active sellers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/items" prefetch={true}>
            <Card className="border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-pointer hover:shadow-md transition-all duration-150 active:scale-95">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Items</span>
                </div>
                <div className="text-2xl font-medium text-gray-900 dark:text-white">{stats?.totalItems || 0}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to manage</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <FolderOpen className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Categories</span>
              </div>
              <div className="text-2xl font-medium text-gray-900 dark:text-white">{stats?.totalCategories || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total categories</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link
                href="/admin/users"
                prefetch={true}
                className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-150"
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Manage Users</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View and manage all users</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/items"
                prefetch={true}
                className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-150"
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Manage Items</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View and moderate listings</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Recent Users</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {stats?.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {user._count.items} items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
