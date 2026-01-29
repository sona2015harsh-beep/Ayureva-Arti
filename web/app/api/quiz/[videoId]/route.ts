import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/quiz/[videoId] - Get questions for a video
export async function GET(request: Request, context: { params: Promise<{ videoId: string }> }) {
    try {
        const { videoId } = await context.params;

        const questions = await prisma.questions.findMany({
            where: { video_id: videoId },
            select: {
                id: true,
                question_text: true,
                option_a: true,
                option_b: true,
                option_c: true,
                option_d: true,
                order_index: true,
                // DO NOT send correct_option to client!
            },
            orderBy: { order_index: 'asc' }
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Fetch quiz error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
