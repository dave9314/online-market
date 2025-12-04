import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT update user profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, email, phone, address, currentPassword, newPassword } = body

    // Validate required fields
    if (!fullName || !phone || !address) {
      return NextResponse.json(
        { error: "Full name, phone, and address are required" },
        { status: 400 }
      )
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update user with new password
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          fullName,
          email: email || null,
          phone,
          address,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          phone: true,
          address: true,
        },
      })

      return NextResponse.json(updatedUser)
    }

    // Update user without password change
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName,
        email: email || null,
        phone,
        address,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
