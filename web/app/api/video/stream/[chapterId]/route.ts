import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ chapterId: string }> }) {
    try {
        const { chapterId } = await context.params;

        // Verify user session
        const profile = await verifySession(request);

        if (!profile) {
            // Check for token in query params (for video players that can't send headers)
            const { searchParams } = new URL(request.url);
            const queryToken = searchParams.get('token');
            if (!queryToken) {
                return new NextResponse('Unauthorized', { status: 401 });
            }
            // For query token, we'd need to verify it - skipping for MVP
        }

        // Find the video (now called videos, was chapters)
        const video = await prisma.videos.findUnique({
            where: { id: chapterId }
        });

        if (!video || !video.video_url) {
            return new NextResponse('Video not found', { status: 404 });
        }

        // TODO: Generate Signed URL for Supabase Storage here
        // For now, redirect to the source URL
        return NextResponse.redirect(video.video_url);

    } catch (error) {
        console.error('Video stream error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
