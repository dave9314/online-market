import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get all items with their ratings
    const items = await prisma.item.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate average rating for each item
    const itemsWithRatings = items
      .map(item => {
        const totalRating = item.ratings.reduce((sum, r) => sum + r.rating, 0)
        const averageRating = item.ratings.length > 0 ? totalRating / item.ratings.length : 0
        
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
          averageRating: Number(averageRating.toFixed(1)),
          totalRatings: item._count.ratings,
        }
      })
      // Filter items that have at least one rating
      .filter(item => item.totalRatings > 0)
      // Sort by average rating (descending), then by total ratings (descending)
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating
        }
        return b.totalRatings - a.totalRatings
      })
      // Return ALL rated items (no limit)

    return NextResponse.json(itemsWithRatings)
  } catch (error) {
    console.error("Error fetching top rated items:", error)
    return NextResponse.json(
      { error: "Failed to fetch top rated items" },
      { status: 500 }
    )
  }
}
