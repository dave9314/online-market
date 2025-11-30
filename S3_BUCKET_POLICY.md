# S3 Bucket Policy Configuration

Since your bucket has ACLs disabled, you need to configure the bucket policy to allow public read access.

## Step 1: Go to your S3 Bucket

1. Open [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click on your bucket: `mela-1212`
3. Go to the "Permissions" tab

## Step 2: Edit Bucket Policy

1. Scroll down to "Bucket policy"
2. Click "Edit"
3. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mela-1212/*"
    }
  ]
}
```

4. Click "Save changes"

## Step 3: Verify Block Public Access Settings

1. In the "Permissions" tab, find "Block public access (bucket settings)"
2. Click "Edit"
3. Make sure these are **UNCHECKED**:
   - ❌ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ❌ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ❌ Block public access to buckets and objects granted through new public bucket or access point policies
   - ❌ Block public and cross-account access to buckets and objects through any public bucket or access point policies

4. Click "Save changes"
5. Type "confirm" when prompted

## Step 4: Verify Object Ownership

1. In the "Permissions" tab, find "Object Ownership"
2. Click "Edit"
3. Select "ACLs disabled (recommended)"
4. Click "Save changes"

This is the correct setting for modern S3 buckets - it uses bucket policies instead of ACLs.

## Step 5: Test Upload

Now try uploading an image in your application. It should work!

## Troubleshooting

If images still don't upload:

1. **Check IAM User Permissions** - Make sure your IAM user has these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::mela-1212/*"
    }
  ]
}
```

2. **Check AWS Credentials** - Verify your `.env` file has correct:
   - AWS_REGION="eu-north-1"
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_S3_BUCKET_NAME="mela-1212"

3. **Restart Dev Server** after making changes:
```bash
npm run dev
```

## Security Note

This bucket policy allows anyone to READ objects from your bucket, but only your application (with IAM credentials) can WRITE/DELETE objects. This is the standard configuration for public file hosting.
