import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/live-classes - Get upcoming live classes for enrolled users
export async function GET(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's enrolled course IDs
        const enrollments = await prisma.enrollments.findMany({
            where: { user_id: profile.id },
            select: { course_id: true }
        });

        const enrolledCourseIds = enrollments.map(e => e.course_id);

        // Get live classes for enrolled courses (or all for admin)
        const liveClasses = await prisma.live_classes.findMany({
            where: profile.role === 'admin'
                ? {}
                : {
                    OR: [
                        { course_id: { in: enrolledCourseIds } },
                        { course_id: null } // General classes without specific course
                    ]
                },
            include: {
                course: {
                    select: { title: true, thumbnail_url: true }
                },
                instructor: {
                    select: { full_name: true, avatar_url: true }
                }
            },
            orderBy: { scheduled_at: 'asc' }
        });

        // Filter to upcoming classes only
        const now = new Date();
        const upcomingClasses = liveClasses.filter(lc => {
            const endTime = new Date(lc.scheduled_at);
            endTime.setMinutes(endTime.getMinutes() + (lc.duration_minutes || 60));
            return endTime > now || lc.is_active;
        });

        return NextResponse.json(upcomingClasses);
    } catch (error) {
        console.error('Fetch live classes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
