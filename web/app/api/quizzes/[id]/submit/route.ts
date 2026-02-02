import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// POST /api/quizzes/[id]/submit - Submit answers
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const { answers } = await request.json(); // Map { questionId: optionKey }

        if (!answers) {
            return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
        }

        // Fetch questions + correct answers
        const questions = await prisma.questions.findMany({
            where: { quiz_id: id }
        });

        if (questions.length === 0) {
            return NextResponse.json({ error: 'Quiz has no questions' }, { status: 404 });
        }

        // Calculate Score
        let score = 0;
        const totalQuestions = questions.length;
        const feedback: { questionId: string; correct: boolean; correctAnswer?: string }[] = [];

        questions.forEach(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct_option;
            if (isCorrect) {
                score++;
            }
            feedback.push({
                questionId: q.id,
                correct: isCorrect,
                correctAnswer: q.correct_option
            });
        });

        const percentage = Math.round((score / totalQuestions) * 100);

        // Fetch Quiz Pass Criteria
        const quiz = await prisma.quizzes.findUnique({
            where: { id },
            select: { passing_percentage: true }
        });
        const passThreshold = quiz?.passing_percentage || 70;
        const passed = percentage >= passThreshold;

        // Manual Upsert Logic (Find existing result for user+quiz)
        const existingResult = await prisma.quiz_results.findFirst({
            where: {
                user_id: profile.id,
                quiz_id: id
            }
        });

        let resultId;

        if (existingResult) {
            const updated = await prisma.quiz_results.update({
                where: { id: existingResult.id },
                data: {
                    score,
                    total_questions: totalQuestions,
                    completed_at: new Date()
                }
            });
            resultId = updated.id;
        } else {
            const created = await prisma.quiz_results.create({
                data: {
                    user_id: profile.id,
                    quiz_id: id,
                    score,
                    total_questions: totalQuestions
                }
            });
            resultId = created.id;
        }

        return NextResponse.json({
            message: 'Quiz submitted successfully',
            score,
            totalQuestions,
            percentage,
            passed,
            feedback,
            resultId
        });

    } catch (error) {
        console.error('Quiz submit error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
