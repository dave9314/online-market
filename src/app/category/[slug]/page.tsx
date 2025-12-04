"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { ArrowLeft, Package, Star } from "lucide-react"

type Item = {
  id: string
  name: string
  price: number
  imageUrl: string
  category: { name: string; slug: string }
  averageRating?: number
  totalRatings?: number
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items for category slug:", slug)
        const response = await fetch("/api/items", { cache: 'no-store' })
        const data = await response.json()
        
        console.log("All items received:", data)
        console.log("Number of items:", data.length)
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data)
          setItems([])
          return
        }
        
        // Filter by category slug
        const filtered = data.filter((item: any) => {
          console.log("Item category:", item.category)
          return item.category?.slug === slug
        })
        
        console.log("Filtered items:", filtered)
        console.log("Number of filtered items:", filtered.length)
        
        setItems(filtered)
      } catch (error) {
        console.error("Failed to fetch items:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchItems()
    }
  }, [slug])

  const categoryName = items[0]?.category.name || slug.replace(/-/g, " ")

  if (loading) {
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

        {/* Category Header */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded p-6 mb-8">
          <h1 className="text-3xl font-normal text-gray-900 dark:text-white capitalize mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} available
          </p>
        </div>

        {items.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-800 rounded p-12 text-center bg-gray-50 dark:bg-gray-900">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => {
              
              return (
                <Link key={item.id} href={`/item/${item.id}`} prefetch={true}>
                  <div className="group cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-150">
                    <div className="relative h-48 bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.price.toFixed(2)} <span className="text-xs font-normal text-gray-500">Birr</span>
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
