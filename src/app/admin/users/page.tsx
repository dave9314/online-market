"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, Shield, User } from "lucide-react"

type User = {
  id: string
  username: string
  fullName: string
  email: string | null
  phone: string
  address: string
  role: string
  createdAt: string
  _count: { items: number }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // Check authentication
      if (status === "loading") return
      
      if (status === "unauthenticated") {
        router.push("/")
        return
      }
      
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard")
        return
      }

      // Fetch users
      try {
        const response = await fetch("/api/admin/users", {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [status, session, router])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? All their items will be deleted too.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId))
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete user")
      }
    } catch (error) {
      alert("Failed to delete user")
    }
  }

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    
    if (!confirm(`Change user role to ${newRole}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map((u) => 
          u.id === userId ? { ...u, role: newRole } : u
        ))
      } else {
        alert("Failed to update user role")
      }
    } catch (error) {
      alert("Failed to update user role")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        </main>
      </div>
    )
  }

  if (session?.user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-6">
            <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left p-3 text-gray-900 dark:text-white">User</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Contact</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Role</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Items</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Joined</th>
                    <th className="text-right p-3 text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">{user.email || "N/A"}</p>
                          <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user.role === "ADMIN" ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">{user._count.items}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleRole(user.id, user.role)}
                            disabled={user.id === session.user.id}
                          >
                            Toggle Role
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === session.user.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
