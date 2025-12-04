import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const items = await prisma.item.findMany({
      where: { ownerId: session.user.id },
      include: {
        category: true,
        _count: {
          select: {
            ratings: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Get average ratings
    const itemIds = items.map(item => item.id)
    const ratings = await prisma.rating.groupBy({
      by: ['itemId'],
      where: {
        itemId: {
          in: itemIds
        }
      },
      _avg: {
        rating: true
      }
    })

    // Map ratings to items
    const ratingsMap = new Map(
      ratings.map(r => [r.itemId, r._avg.rating || 0])
    )

    const itemsWithRatings = items.map(item => ({
      ...item,
      averageRating: Number((ratingsMap.get(item.id) || 0).toFixed(1)),
      totalRatings: item._count.ratings,
    }))

    return NextResponse.json(itemsWithRatings)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}
