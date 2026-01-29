import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/video-progress - Get all user's video progress
export async function GET(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const progress = await prisma.video_progress.findMany({
            where: { user_id: profile.id },
            include: {
                video: {
                    include: {
                        module: {
                            include: {
                                course: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error('Fetch video progress error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/video-progress - Update video progress
export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { video_id, progress_seconds, is_completed } = await request.json();

        if (!video_id) {
            return NextResponse.json({ error: 'video_id is required' }, { status: 400 });
        }

        const videoProgress = await prisma.video_progress.upsert({
            where: {
                user_id_video_id: {
                    user_id: profile.id,
                    video_id
                }
            },
            update: {
                progress_seconds: progress_seconds ?? undefined,
                is_completed: is_completed ?? undefined,
                last_watched_at: new Date()
            },
            create: {
                user_id: profile.id,
                video_id,
                progress_seconds: progress_seconds || 0,
                is_completed: is_completed || false
            }
        });

        return NextResponse.json(videoProgress);
    } catch (error) {
        console.error('Update video progress error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
