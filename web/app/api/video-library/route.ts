import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all videos in the library
export async function GET() {
    try {
        const videos = await prisma.video_library.findMany({
            orderBy: { created_at: 'desc' }
        });
        // Serialize BigInt for JSON
        const serializedVideos = videos.map(v => ({
            ...v,
            size_bytes: v.size_bytes?.toString() || '0'
        }));
        return NextResponse.json(serializedVideos);
    } catch (error) {
        console.error('Failed to fetch video library:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Add a new video to the library (Metadata only, after S3 upload)
export async function POST(request: Request) {
    try {
        const requestJson = await request.json();
        const { title, filename, video_url, size_bytes, duration } = requestJson;

        if (!title || !video_url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const video = await prisma.video_library.create({
            data: {
                title,
                filename: filename || title,
                video_url,
                thumbnail_url: requestJson.thumbnail_url || null,
                size_bytes: size_bytes || 0,
                duration: duration || 0
            }
        });

        const serializedVideo = {
            ...video,
            size_bytes: video.size_bytes?.toString() || '0'
        };

        return NextResponse.json(serializedVideo);
    } catch (error) {
        console.error('Failed to add to library:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
