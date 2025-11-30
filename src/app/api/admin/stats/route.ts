import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const [totalUsers, totalItems, totalCategories, recentUsers, usersWithItems] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.category.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          fullName: true,
          createdAt: true,
          _count: {
            select: { items: true }
          }
        }
      }),
      prisma.user.count({
        where: {
          items: {
            some: {}
          }
        }
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalItems,
      totalCategories,
      recentUsers,
      usersWithItems,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
