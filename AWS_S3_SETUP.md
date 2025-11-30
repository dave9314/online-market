# AWS S3 Setup Guide for Used Marketplace

This guide will help you set up AWS S3 for image storage in your marketplace application.

## Prerequisites
- An AWS account
- AWS CLI installed (optional but recommended)

## Step 1: Create an S3 Bucket

1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. Configure your bucket:
   - **Bucket name**: Choose a unique name (e.g., `used-marketplace-images`)
   - **Region**: Select your preferred region (e.g., `us-east-1`)
   - **Block Public Access settings**: Uncheck "Block all public access" (we need public read access for images)
   - Check the acknowledgment box
4. Click "Create bucket"

## Step 2: Configure Bucket Policy for Public Read Access

1. Go to your bucket
2. Click on the "Permissions" tab
3. Scroll down to "Bucket policy"
4. Click "Edit" and paste this policy (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

5. Click "Save changes"

## Step 3: Create IAM User for Application Access

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Add users"
3. User name: `marketplace-uploader`
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Click "Create policy" → "JSON" tab
8. Paste this policy (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

9. Click "Review policy"
10. Name: `MarketplaceS3UploadPolicy`
11. Click "Create policy"
12. Go back to user creation, refresh policies, and select your new policy
13. Click "Next" → "Create user"
14. **IMPORTANT**: Save the Access Key ID and Secret Access Key (you won't see them again!)

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update your `.env` file with AWS credentials:

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key-id-here"
AWS_SECRET_ACCESS_KEY="your-secret-access-key-here"
AWS_S3_BUCKET_NAME="your-bucket-name-here"
```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Test the Upload

1. Start your development server:
```bash
npm run dev
```

2. Try uploading an image when posting an item
3. Check your S3 bucket to verify the image was uploaded

## CORS Configuration (Optional)

If you need to access images from different domains, configure CORS:

1. Go to your S3 bucket
2. Click "Permissions" → "Cross-origin resource sharing (CORS)"
3. Add this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## Security Best Practices

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. **Use IAM roles** in production instead of access keys when possible
3. **Rotate access keys** regularly
4. **Enable S3 bucket versioning** for backup
5. **Set up CloudFront** for better performance and security
6. **Enable S3 server-side encryption**

## Troubleshooting

### Images not uploading
- Check AWS credentials in `.env`
- Verify IAM user has correct permissions
- Check bucket policy allows PutObject

### Images not displaying
- Verify bucket policy allows public GetObject
- Check image URLs in database
- Verify Next.js image domains configuration

### Access Denied errors
- Check IAM policy permissions
- Verify bucket name is correct
- Check AWS region matches

## Cost Estimation

AWS S3 pricing (as of 2024):
- Storage: ~$0.023 per GB/month
- PUT requests: $0.005 per 1,000 requests
- GET requests: $0.0004 per 1,000 requests

For a small marketplace with 1000 images (~5GB):
- Monthly cost: ~$0.12 + minimal request costs

## Production Recommendations

1. **Use CloudFront CDN** for faster image delivery
2. **Enable S3 Transfer Acceleration** for faster uploads
3. **Set up lifecycle policies** to archive old images
4. **Enable S3 access logging** for security monitoring
5. **Use S3 Object Lock** for compliance if needed

## Support

For AWS-specific issues, refer to:
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)
