import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import { verifySession } from '@/lib/auth';

// POST /api/video/sign-url
// Generates a presigned URL for viewing a video
export async function POST(request: Request) {
    try {
        const session = await verifySession(request);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ error: 'Video key is required' }, { status: 400 });
        }

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        // URL valid for 3 hours
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 10800 });

        return NextResponse.json({ url: signedUrl });

    } catch (error) {
        console.error('Sign URL Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
