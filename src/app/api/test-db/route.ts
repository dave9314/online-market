import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Try to count users
    const userCount = await prisma.user.count()
    
    // Try to get first user (without password)
    const firstUser = await prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json({
      success: true,
      connected: true,
      userCount,
      firstUser,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
    }, { status: 500 })
  }
}
