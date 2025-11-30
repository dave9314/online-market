import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { itemSchema } from "@/lib/validations"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")

    const items = await prisma.item.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          }
        },
        owner: {
          select: {
            username: true,
            fullName: true,
          }
        },
        _count: {
          select: {
            ratings: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit results for better performance
    })

    // Get average ratings in a separate optimized query
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

    const response = NextResponse.json(itemsWithRatings)
    // Disable caching to prevent stale data issues
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error("Items fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.error("Unauthorized: No session")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log("Received item data:", body)
    
    const validatedData = itemSchema.parse(body)
    console.log("Validated data:", validatedData)

    const item = await prisma.item.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
      },
      include: {
        category: {
          select: {
            name: true,
          }
        },
        owner: {
          select: {
            username: true,
            fullName: true,
          }
        }
      }
    })

    console.log("Item created successfully:", item)
    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    console.error("Item creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create item" },
      { status: 500 }
    )
  }
}
