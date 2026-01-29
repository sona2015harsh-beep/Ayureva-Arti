import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/admin/questions - List all questions (with video/module info)
export async function GET(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const questions = await prisma.questions.findMany({
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
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Fetch questions error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/questions - Create a new question
export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const {
            video_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            explanation,
            order_index
        } = await request.json();

        if (!video_id || !question_text || !option_a || !option_b || !correct_option) {
            return NextResponse.json({
                error: 'Missing required fields: video_id, question_text, option_a, option_b, correct_option'
            }, { status: 400 });
        }

        const question = await prisma.questions.create({
            data: {
                video_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_option,
                explanation,
                order_index: order_index || 1
            }
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error('Create question error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/questions?id=... - Delete a question
export async function DELETE(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
        }

        await prisma.questions.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Question deleted' });
    } catch (error) {
        console.error('Delete question error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
