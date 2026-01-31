import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// POST /api/video-progress
// Updates the user's progress for a specific video
export async function POST(request: Request) {
    try {
        const session = await verifySession(request);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { video_id, position_seconds, is_completed } = await request.json();

        if (!video_id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
        }

        // Upsert progress
        const progress = await prisma.video_progress.upsert({
            where: {
                user_id_video_id: {
                    user_id: session.id,
                    video_id: video_id
                }
            },
            update: {
                position_seconds: position_seconds || 0,
                // Only mark as completed if it's explicitly sent as true, otherwise keep existing state or false
                is_completed: is_completed === true ? true : undefined,
                last_watched_at: new Date(),
                updated_at: new Date()
            },
            create: {
                user_id: session.id,
                video_id: video_id,
                position_seconds: position_seconds || 0,
                is_completed: is_completed || false,
                last_watched_at: new Date()
            }
        });

        return NextResponse.json(progress);

    } catch (error) {
        console.error('Video Progress Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
