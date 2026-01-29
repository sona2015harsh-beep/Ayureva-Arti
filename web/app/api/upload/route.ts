import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';
import { verifySession } from '@/lib/auth'; // Ensure admin is uploading

export async function POST(request: Request) {
    try {
        // 1. Verify Authentication
        // In real app, check for Admin Role

        const { filename, filetype } = await request.json();

        // 2. Generate Unique Key
        const fileExtension = filename.split('.').pop();
        const key = `videos/${uuidv4()}.${fileExtension}`;

        // 3. Create Presigned URL
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: filetype,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return NextResponse.json({
            uploadUrl: presignedUrl,
            key: key
        });

    } catch (error) {
        console.error('Failed to generate presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
    }
}
