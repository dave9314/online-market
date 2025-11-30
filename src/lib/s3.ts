import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// Validate environment variables
const validateConfig = () => {
  const required = {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing AWS configuration: ${missing.join(", ")}`)
  }

  return required as Record<string, string>
}

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const config = validateConfig()

    // Create S3 client with proper configuration
    const s3Client = new S3Client({
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    })

    const key = `marketplace/${Date.now()}-${fileName.replace(/\s/g, "-")}`

    const command = new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Don't use ACL - rely on bucket policy for public access
    })

    await s3Client.send(command)

    // Return the public URL - use the correct format based on region
    const region = config.AWS_REGION
    if (region === "us-east-1") {
      return `https://${config.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    } else {
      return `https://${config.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
    }
  } catch (error: any) {
    console.error("S3 Upload Error:", error)
    throw new Error(`Failed to upload to S3: ${error.message}`)
  }
}
