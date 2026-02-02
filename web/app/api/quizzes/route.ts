import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/quizzes - List quizzes with filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'VIDEO', 'MODULE', 'SUBJECT', 'MOCK'
        const videoId = searchParams.get('videoId');
        const moduleId = searchParams.get('moduleId');
        const courseId = searchParams.get('courseId');
        const isMock = searchParams.get('isMock') === 'true';

        // Build where clause
        const where: any = { is_active: true };

        if (type) where.type = type;
        if (videoId) where.video_id = videoId;
        if (moduleId) where.module_id = moduleId;
        if (courseId) where.course_id = courseId;

        // Special case for "Mock Tests" list (independent of course context usually, or specific type)
        if (isMock) {
            where.type = 'MOCK';
        }

        const quizzes = await prisma.quizzes.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { questions: true }
                }
            }
        });

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Fetch quizzes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const {
            title,
            description,
            type, // 'VIDEO', 'MODULE', 'SUBJECT', 'MOCK'
            video_id,
            module_id,
            course_id,
            time_limit_minutes,
            passing_percentage
        } = body;

        if (!title || !type) {
            return NextResponse.json({ error: 'Title and Type are required' }, { status: 400 });
        }

        const quiz = await prisma.quizzes.create({
            data: {
                title,
                description,
                type,
                video_id: video_id || null,
                module_id: module_id || null,
                course_id: course_id || null,
                time_limit_minutes: time_limit_minutes ? parseInt(time_limit_minutes) : null,
                passing_percentage: passing_percentage ? parseInt(passing_percentage) : 70,
                is_active: true
            }
        });

        return NextResponse.json(quiz, { status: 201 });
    } catch (error) {
        console.error('Create quiz error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
