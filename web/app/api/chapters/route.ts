import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Legacy endpoint - chapters are now called modules in the new schema
// Keeping this route for backwards compatibility

export async function POST(request: Request) {
    try {
        const { title, description, videoUrl, courseId, order } = await request.json();

        if (!title || !courseId) {
            return NextResponse.json({ error: 'Title and courseId required' }, { status: 400 });
        }

        // Create as module in new schema
        const module = await prisma.modules.create({
            data: {
                title,
                course_id: courseId,
                order_index: order || 1
            }
        });

        // If video URL provided, create video under module
        if (videoUrl) {
            await prisma.videos.create({
                data: {
                    title,
                    video_url: videoUrl,
                    module_id: module.id,
                    order_index: 1
                }
            });
        }

        return NextResponse.json(module);
    } catch (error) {
        console.error('Chapter creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
