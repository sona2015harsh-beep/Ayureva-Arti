import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';
import { randomUUID } from 'crypto';

// GET /api/admin/live-classes - List all live classes
export async function GET(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const liveClasses = await prisma.live_classes.findMany({
            include: {
                course: true,
                instructor: true
            },
            orderBy: { scheduled_at: 'desc' }
        });

        return NextResponse.json(liveClasses);
    } catch (error) {
        console.error('Fetch live classes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/live-classes - Schedule a new live class
export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const {
            title,
            description,
            course_id,
            scheduled_at,
            duration_minutes,
            max_participants
        } = await request.json();

        if (!title || !scheduled_at) {
            return NextResponse.json({
                error: 'Title and scheduled_at are required'
            }, { status: 400 });
        }

        // Generate unique Jitsi room ID
        const jitsi_room_id = `ayureva-${randomUUID().substring(0, 8)}`;

        const liveClass = await prisma.live_classes.create({
            data: {
                title,
                description,
                course_id,
                instructor_id: profile.id,
                jitsi_room_id,
                scheduled_at: new Date(scheduled_at),
                duration_minutes: duration_minutes || 60,
                max_participants: max_participants || 100,
                is_active: false
            }
        });

        return NextResponse.json(liveClass, { status: 201 });
    } catch (error) {
        console.error('Create live class error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/admin/live-classes?id=... - Toggle live class active status
export async function PATCH(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || !['admin', 'instructor'].includes(profile.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const { is_active } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Live class ID required' }, { status: 400 });
        }

        const liveClass = await prisma.live_classes.update({
            where: { id },
            data: { is_active }
        });

        return NextResponse.json(liveClass);
    } catch (error) {
        console.error('Update live class error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/live-classes?id=...
export async function DELETE(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Live class ID required' }, { status: 400 });
        }

        await prisma.live_classes.delete({ where: { id } });

        return NextResponse.json({ message: 'Live class deleted' });
    } catch (error) {
        console.error('Delete live class error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
