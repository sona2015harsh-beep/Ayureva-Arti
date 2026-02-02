import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/questions - List questions for a quiz
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const quizId = searchParams.get('quizId');

        if (!quizId) {
            return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
        }

        const questions = await prisma.questions.findMany({
            where: { quiz_id: quizId },
            select: {
                id: true,
                question_text: true,
                option_a: true,
                option_b: true,
                option_c: true,
                option_d: true,
                order_index: true,
                // DO NOT send correct_option to client!
                // explanation: false // Hide explanation too until result
            },
            orderBy: { order_index: 'asc' }
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Fetch questions error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/questions - Add a question to a quiz
export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const {
            quiz_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            explanation,
            order_index
        } = body;

        if (!quiz_id || !question_text || !option_a || !option_b || !correct_option) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const question = await prisma.questions.create({
            data: {
                quiz_id,
                question_text,
                option_a,
                option_b,
                option_c: option_c || null,
                option_d: option_d || null,
                correct_option,
                explanation: explanation || null,
                order_index: order_index || 1
            }
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error('Create question error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
