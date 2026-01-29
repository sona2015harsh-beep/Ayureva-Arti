import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { videoId, answers } = await request.json();

        if (!videoId || !answers) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch correct answers (server side only)
        const questions = await prisma.questions.findMany({
            where: { video_id: videoId }
        });

        if (questions.length === 0) {
            return NextResponse.json({ error: 'No quiz found for this video' }, { status: 404 });
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

        // Save/Update Result
        const result = await prisma.quiz_results.upsert({
            where: {
                user_id_video_id: {
                    user_id: profile.id,
                    video_id: videoId
                }
            },
            update: {
                score,
                total_questions: totalQuestions,
                completed_at: new Date()
            },
            create: {
                user_id: profile.id,
                video_id: videoId,
                score,
                total_questions: totalQuestions
            }
        });

        const percentage = Math.round((score / totalQuestions) * 100);

        return NextResponse.json({
            message: 'Quiz submitted successfully',
            score,
            totalQuestions,
            percentage,
            passed: percentage >= 70, // 70% pass threshold
            feedback,
            resultId: result.id
        });

    } catch (error) {
        console.error('Quiz submit error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
