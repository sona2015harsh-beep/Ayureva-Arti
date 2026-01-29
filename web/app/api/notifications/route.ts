import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/notifications - Get user's notifications
export async function GET(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.notifications.findMany({
            where: { user_id: profile.id },
            orderBy: { created_at: 'desc' },
            take: 50 // Limit to last 50
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationIds, markAllRead } = await request.json();

        if (markAllRead) {
            await prisma.notifications.updateMany({
                where: { user_id: profile.id, is_read: false },
                data: { is_read: true }
            });
        } else if (notificationIds && notificationIds.length > 0) {
            await prisma.notifications.updateMany({
                where: {
                    id: { in: notificationIds },
                    user_id: profile.id
                },
                data: { is_read: true }
            });
        }

        return NextResponse.json({ message: 'Notifications updated' });
    } catch (error) {
        console.error('Update notifications error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
