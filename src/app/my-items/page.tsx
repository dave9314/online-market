"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Package, Plus, Star } from "lucide-react"

type Item = {
  id: string
  name: string
  price: number
  imageUrl: string
  createdAt: string
  category: { name: string }
  averageRating?: number
  totalRatings?: number
}

export default function MyItemsPage() {
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

      if (status !== "authenticated") return

      try {
        const response = await fetch("/api/my-items", { 
          next: { revalidate: 30 }
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
  }, [status, router])

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          prefetch={true}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors duration-150"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>

        <div className="bg-gray-100 dark:bg-gray-900 rounded p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-normal text-gray-900 dark:text-white mb-2">My Items</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your posted items</p>
            </div>
            <Link href="/post-item" prefetch={true}>
              <button className="flex items-center space-x-2 px-5 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded transition-all duration-150 active:scale-95">
                <Plus className="h-4 w-4" />
                <span>Post New Item</span>
              </button>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-800 rounded p-12 text-center bg-gray-50 dark:bg-gray-900">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't posted any items</p>
            <Link href="/post-item" prefetch={true}>
              <button className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded transition-all duration-150 active:scale-95">
                <Plus className="h-4 w-4" />
                <span>Post Your First Item</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => {
              
              return (
                <div key={item.id} className="group">
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all mb-3">
                    <div className="relative h-48 bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {item.averageRating && item.averageRating > 0 ? (
                        <div className="absolute top-2 right-2 flex items-center space-x-0.5 px-1.5 py-0.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-md shadow-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.averageRating}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({item.totalRatings})</span>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 flex items-center space-x-0.5 px-1.5 py-0.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-md shadow-sm">
                          <Star className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                          <span className="text-xs text-gray-400 dark:text-gray-500">No ratings</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5">
                        {item.category.name}
                      </span>
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        {item.price.toFixed(2)} <span className="text-xs font-normal text-gray-500">Birr</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/edit-item/${item.id}`} prefetch={true} className="flex-1">
                      <Button variant="outline" className="w-full text-xs py-1.5 transition-all duration-150 active:scale-95">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 text-xs py-1.5 transition-all duration-150 active:scale-95"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
