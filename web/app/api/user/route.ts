import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const profile = await verifySession(request);

        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: profile.role,
            created_at: profile.created_at
        });
    } catch (error) {
        console.error('Failed to get user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
