import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { title, course_id, order_index, video_url, unlock_at } = await request.json();

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

        // 2. Create Video (Lesson) if video_url is provided
        if (video_url) {
            await prisma.videos.create({
                data: {
                    title: title, // Use module title for video for now
                    module_id: module.id,
                    video_url: video_url,
                    order_index: 1,
                    unlock_at: unlock_at ? new Date(unlock_at) : null
                }
            });
        }

        return NextResponse.json(module);
    } catch (error) {
        console.error('Failed to create module/video:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
