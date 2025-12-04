"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"

type Item = {
  id: string
  name: string
  price: number
  imageUrl: string
  createdAt: string
  category: { name: string }
  owner: { id: string; username: string; fullName: string }
}

export default function AdminItemsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
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
        const response = await fetch("/api/admin/items", {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (error) {
        console.error("Failed to fetch items:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [status, session, router])

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemId))
      } else {
        alert("Failed to delete item")
      }
    } catch (error) {
      alert("Failed to delete item")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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
            <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white">Item Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left p-3 text-gray-900 dark:text-white">Image</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Item</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Category</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Price</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Owner</th>
                    <th className="text-left p-3 text-gray-900 dark:text-white">Posted</th>
                    <th className="text-right p-3 text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-3">
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/item/${item.id}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">{item.category.name}</td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">
                        {item.price.toFixed(2)} Birr
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.owner.fullName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{item.owner.username}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
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
