"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Star, TrendingUp } from "lucide-react"

type Item = {
  id: string
  name: string
  price: number
  imageUrl: string
  category: { name: string }
  averageRating?: number
  totalRatings?: number
}

export default function TopRatedPage() {
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

      setLoading(true)
      try {
        const response = await fetch("/api/items/top-rated", {
          next: { revalidate: 60 }
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (error) {
        console.error("Failed to fetch top rated items:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center flex-1">
          <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-6 py-6 flex-1 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-6 mb-6 border border-yellow-100 dark:border-yellow-900/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Top Rated Items</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All rated items sorted from highest to lowest rating • {items.length} items
          </p>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-10 text-center shadow-sm">
            <Star className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No Rated Items Yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Items will appear here once they receive ratings</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item, index) => (
              <Link key={item.id} href={`/item/${item.id}`} prefetch={true}>
                <div className="group cursor-pointer bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-yellow-200 dark:hover:border-yellow-900 transition-all duration-150">
                  {/* Rank Badge */}
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 px-2 py-1 bg-yellow-500 rounded-md shadow-sm">
                      <span className="text-xs font-bold text-white">#{index + 1}</span>
                    </div>
                    
                    {/* Image */}
                    <div className="relative h-48 bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 flex items-center space-x-0.5 px-1.5 py-0.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-md shadow-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {item.averageRating?.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({item.totalRatings})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
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
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
