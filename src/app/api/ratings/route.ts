import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, rating, comment } = await request.json()

    if (!itemId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Check if user already rated this item
    const existingRating = await prisma.rating.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId: session.user.id,
        },
      },
    })

    let result
    if (existingRating) {
      // Update existing rating
      result = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating, comment },
      })
    } else {
      // Create new rating
      result = await prisma.rating.create({
        data: {
          itemId,
          userId: session.user.id,
          rating,
          comment,
        },
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Rating error:", error)
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 })
    }

    const ratings = await prisma.rating.findMany({
      where: { itemId },
      include: {
        item: {
          select: {
            owner: {
              select: {
                fullName: true,
                username: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0

    return NextResponse.json({
      ratings,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    })
  } catch (error) {
    console.error("Get ratings error:", error)
    return NextResponse.json({ error: "Failed to get ratings" }, { status: 500 })
  }
}
