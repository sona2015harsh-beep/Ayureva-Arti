import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// POST /api/device-token - Register FCM device token
export async function POST(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { token, platform } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Upsert device token
        await prisma.device_tokens.upsert({
            where: {
                user_id_token: {
                    user_id: profile.id,
                    token
                }
            },
            update: {
                platform,
                created_at: new Date()
            },
            create: {
                user_id: profile.id,
                token,
                platform: platform || 'unknown'
            }
        });

        return NextResponse.json({ message: 'Device token registered' });
    } catch (error) {
        console.error('Register device token error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/device-token - Remove device token (logout)
export async function DELETE(request: Request) {
    try {
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        await prisma.device_tokens.deleteMany({
            where: {
                user_id: profile.id,
                token
            }
        });

        return NextResponse.json({ message: 'Device token removed' });
    } catch (error) {
        console.error('Remove device token error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
