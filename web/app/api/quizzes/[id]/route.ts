import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/quizzes/[id] - Get single quiz details
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const quiz = await prisma.quizzes.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { questions: true }
                }
                // We might want to include questions here or fetch them separately via /api/questions?quizId=...
                // Fetching separately is better for "taking" the quiz so we can mask answers.
                // But for "editing" (admin), we might want everything.
            }
        });

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Fetch quiz error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/quizzes/[id] - Delete a quiz
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await context.params;

        await prisma.quizzes.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/quizzes/[id] - Update a quiz
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await context.params;
        const body = await request.json();

        const {
            title,
            description,
            type,
            video_id,
            module_id,
            course_id,
            time_limit_minutes,
            passing_percentage,
            is_active
        } = body;

        const quiz = await prisma.quizzes.update({
            where: { id },
            data: {
                title,
                description,
                type,
                video_id,
                module_id,
                course_id,
                time_limit_minutes: time_limit_minutes ? parseInt(time_limit_minutes) : undefined,
                passing_percentage: passing_percentage ? parseInt(passing_percentage) : undefined,
                is_active
            }
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Update quiz error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
