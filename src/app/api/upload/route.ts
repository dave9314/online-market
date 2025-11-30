import { NextResponse } from "next/server"
import { uploadToS3 } from "@/lib/s3"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to S3
    const url = await uploadToS3(buffer, file.name, file.type)

    console.log("Upload successful:", url)
    return NextResponse.json({ url })
  } catch (error: any) {
    console.error("Upload error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
    })
    
    // Return a more user-friendly error
    return NextResponse.json(
      { error: "Failed to upload image. Please check your AWS credentials and try again." },
      { status: 500 }
    )
  }
}
