import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { title, module_id, order_index, video_url, duration, is_free_preview } = await request.json();

        if (!title || !module_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const video = await prisma.videos.create({
            data: {
                title,
                module_id,
                order_index: order_index || 1,
                video_url,
                duration,
                is_free_preview: is_free_preview || false
            }
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error('Failed to create video:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
