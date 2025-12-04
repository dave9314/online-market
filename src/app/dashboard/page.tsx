"use client"

import { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Plus, Car, Laptop, Sofa, Package, Star } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  _count: { items: number }
}

type Item = {
  id: string
  name: string
  price: number
  imageUrl: string
  category: { name: string }
  averageRating?: number
  totalRatings?: number
}

const categoryIcons: Record<string, any> = {
  "used-vehicles": Car,
  "used-electronics": Laptop,
  "used-furniture": Sofa,
  "other-used-items": Package,
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredItems, setFeaturedItems] = useState<Item[]>([])
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
        console.log("Fetching dashboard data...")
        const [categoriesRes, itemsRes] = await Promise.all([
          fetch("/api/categories", { 
            next: { revalidate: 60 }
          }),
          fetch("/api/items", { 
            next: { revalidate: 30 }
          }),
        ])

        console.log("Categories response status:", categoriesRes.status)
        console.log("Items response status:", itemsRes.status)

        if (!categoriesRes.ok || !itemsRes.ok) {
          throw new Error("Failed to fetch data from API")
        }

        const categoriesData = await categoriesRes.json()
        let itemsData = await itemsRes.json()

        console.log("Categories received:", categoriesData.length)
        console.log("Items received:", itemsData.length)

        // Ensure itemsData is an array
        if (!Array.isArray(itemsData)) {
          console.error("Items data is not an array:", itemsData)
          itemsData = []
        }

        // Ensure categoriesData is an array
        if (!Array.isArray(categoriesData)) {
          console.error("Categories data is not an array:", categoriesData)
          setCategories([])
        } else {
          setCategories(categoriesData)
        }

        // Filter items based on search query
        if (searchQuery && itemsData.length > 0) {
          itemsData = itemsData.filter((item: Item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        // Show all items
        setFeaturedItems(itemsData)
        console.log("Dashboard data loaded successfully")
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setFeaturedItems([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [status, searchQuery, session?.user?.id, router])

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
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-base font-semibold mb-0.5 text-gray-900 dark:text-white">
                Welcome, <span className="text-blue-600 dark:text-blue-400">{session?.user?.name}</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Browse items or list something to sell
              </p>
            </div>
            <Link href="/post-item" prefetch={true}>
              <button className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all duration-150 active:scale-95">
                <Plus className="h-3.5 w-3.5" />
                <span>Post Item</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || Package
              
              return (
                <Link key={category.id} href={`/category/${category.slug}`} prefetch={true}>
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-150 cursor-pointer group">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category._count.items} items
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Featured Items Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Recent Items"}
          </h2>
          
          {featuredItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-10 text-center shadow-sm">
              <Package className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No Items Yet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Be the first to post an item</p>
              <Link href="/post-item" prefetch={true}>
                <button className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all duration-150 active:scale-95">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Post Your First Item</span>
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.isArray(featuredItems) && featuredItems.map((item) => {
                return (
                  <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all">
                    <div className="relative h-48 bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover"
                        loading="lazy"
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                      />
                      {/* Rating Badge */}
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
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {item.price.toFixed(2)} <span className="text-xs font-normal text-gray-500">Birr</span>
                      </p>
                      <Link href={`/item/${item.id}`} prefetch={true}>
                        <button className="w-full py-1.5 px-3 text-xs font-medium bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-lg transition-all duration-150 active:scale-95">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center flex-1">
          <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
