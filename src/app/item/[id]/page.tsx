"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, Calendar, Tag, Trash2, User as UserIcon, Star, Edit } from "lucide-react"

type Item = {
  id: string
  name: string
  description?: string
  price: number
  manufacturedDate: string
  imageUrl: string
  contactEmail: string
  category: { name: string }
  owner: { username: string; fullName: string }
  ownerId: string
}

export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const [itemResponse, ratingsResponse] = await Promise.all([
          fetch(`/api/items/${params.id}`),
          fetch(`/api/ratings?itemId=${params.id}`)
        ])
        
        if (itemResponse.ok) {
          const data = await itemResponse.json()
          setItem(data)
        }
        
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json()
          setAverageRating(ratingsData.averageRating)
          setTotalRatings(ratingsData.totalRatings)
          
          // Find user's rating if exists
          const myRating = ratingsData.ratings.find((r: any) => r.userId === session?.user?.id)
          if (myRating) {
            setUserRating(myRating.rating)
          }
        }
      } catch (error) {
        console.error("Failed to fetch item:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchItem()
    }
  }, [params.id, session])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/items/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert("Failed to delete item")
      }
    } catch (error) {
      alert("Failed to delete item")
    } finally {
      setDeleting(false)
    }
  }

  const handleRating = async (rating: number) => {
    if (!session?.user || isOwner) return
    
    setSubmittingRating(true)
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: params.id,
          rating,
        }),
      })

      if (response.ok) {
        setUserRating(rating)
        // Refresh ratings
        const ratingsResponse = await fetch(`/api/ratings?itemId=${params.id}`)
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json()
          setAverageRating(ratingsData.averageRating)
          setTotalRatings(ratingsData.totalRatings)
        }
      }
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Item not found</p>
        </div>
      </div>
    )
  }

  const isOwner = session?.user?.id === item.ownerId

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="relative h-96 lg:h-[600px] bg-gray-100 dark:bg-gray-900 rounded overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain p-4"
            />
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded text-xs font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span>{item.category.name}</span>
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-normal text-gray-900 dark:text-white mb-3">{item.name}</h1>
              <p className="text-3xl font-medium text-gray-900 dark:text-white mb-3">
                {item.price.toFixed(2)} Birr
              </p>
              
              {/* Rating Display and Input */}
              <div className="flex items-center space-x-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {averageRating > 0 ? averageRating : "No ratings"}
                  </span>
                  {totalRatings > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                    </span>
                  )}
                </div>
              </div>
              
              {/* User Rating Input */}
              {session?.user && !isOwner && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {userRating > 0 ? 'Your rating:' : 'Rate this item:'}
                  </p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={submittingRating}
                        className="transition-transform hover:scale-110 disabled:opacity-50"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoverRating || userRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {item.description && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manufactured Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.manufacturedDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contact Seller</p>
                  <a
                    href={`mailto:${item.contactEmail}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 break-all"
                  >
                    {item.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Seller</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.owner.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{item.owner.username}</p>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Link href={`/edit-item/${item.id}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Item
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? "Deleting..." : "Delete Item"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
