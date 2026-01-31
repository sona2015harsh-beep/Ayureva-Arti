# Production Setup Guide

Before going live, you must configure these services.

## 1. AWS S3 (Video Storage)
1.  **Create Bucket:**
    - Name: `ayureva-videos` (or similar)
    - Region: `ap-south-1` (Mumbai)
    - **Permissions:** Uncheck "Block all public access" (for now) OR set up a CloudFront distribution for secure access.
    - **CORS Configuration:**
      ```json
      [
          {
              "AllowedHeaders": ["*"],
              "AllowedMethods": ["PUT", "POST", "GET"],
              "AllowedOrigins": ["*"],
              "ExposeHeaders": ["ETag"]
          }
      ]
      ```

2.  **Create IAM User:**
    - Go to IAM -> Users -> Create User (`ayureva-uploader`).
    - Attach Policy directly: `AmazonS3FullAccess` (or restrict to just your bucket).
    - Create **Access Keys** (Access Key ID and Secret Access Key).

3.  **Update Environment Variables (`web/.env`):**
    ```env
    AWS_REGION=ap-south-1
    AWS_ACCESS_KEY_ID=your_access_key
    AWS_SECRET_ACCESS_KEY=your_secret_key
    AWS_BUCKET_NAME=ayureva-videos
    ```

## 2. Razorpay (Payments)
1.  **Sign Up:** Create account at dashboard.razorpay.com.
2.  **Generate Keys:** Settings -> API Keys -> Generate Key.
3.  **Update Environment Variables (`web/.env`):**
    ```env
    NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_... (or rzp_live_...)
    RAZORPAY_KEY_SECRET=your_secret
    ```

## 3. Deployment
- **Web:** Vercel (Add the above env vars in Vercel Project Settings).
- **Mobile:** `flutter build apk --release`.
