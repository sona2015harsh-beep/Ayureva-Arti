import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const requestJson = await request.json();
        const { title, course_id, order_index, video_url, unlock_at, thumbnail_url } = requestJson;

        if (!title || !course_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create Module (Section)
        const module = await prisma.modules.create({
            data: {
                title,
                course_id,
                order_index: order_index || 1
            }
        });

        // 2. Create Video (Lesson)
        if (video_url || requestJson.video_library_id) {
            const videoData: any = {
                title: title, // Use module title for video for now
                module_id: module.id,
                order_index: 1,
                unlock_at: unlock_at ? new Date(unlock_at) : null
            };

            if (requestJson.video_library_id) {
                // Link to Library Video
                videoData.video_library_id = requestJson.video_library_id;
                // We might want to copy the URL from the library for easier access, 
                // or just rely on the relation. For existing frontend compatibility, let's copy the URL if available in the library search
                // But here we might not have it.
                // It's safer to ensure we save the URL if provided, or fetch it. 
                // For now, let's assume the frontend sends the URL too if it selected from library, OR we rely on the join.
                // Actually, existing frontend expects `video_url` in `videos` table.
                if (video_url) {
                    videoData.video_url = video_url;
                }
                // Allow overriding thumbnail even if linked
                if (thumbnail_url) {
                    videoData.thumbnail_url = thumbnail_url;
                }
            } else {
                // Direct Upload (Legacy/One-off)
                videoData.video_url = video_url;
                videoData.thumbnail_url = thumbnail_url;
            }

            await prisma.videos.create({
                data: videoData
            });
        }

        return NextResponse.json(module);
    } catch (error) {
        console.error('Failed to create module/video:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
