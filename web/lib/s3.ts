import { S3Client } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION || 'ap-south-1'; // Default to Mumbai

export const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'ayureva-videos';

export function getS3Url(key: string) {
    // If using CloudFront, this should be the CloudFront domain
    // For now, returning direct S3 or Proxy URL
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
}
