import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signUpSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = signUpSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        password: hashedPassword,
        fullName: validatedData.fullName,
        address: validatedData.address,
        phone: validatedData.phone,
      }
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    )
  }
}
