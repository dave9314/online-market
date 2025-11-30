import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        owner: {
          select: {
            username: true,
            fullName: true,
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const item = await prisma.item.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    if (item.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.item.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const item = await prisma.item.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    if (item.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const updatedItem = await prisma.item.update({
      where: { id: params.id },
      data: body,
      include: {
        category: true,
        owner: {
          select: {
            username: true,
            fullName: true,
          }
        }
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    )
  }
}
