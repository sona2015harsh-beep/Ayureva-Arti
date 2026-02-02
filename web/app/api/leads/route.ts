import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { full_name, phone_number, message } = body;

        if (!full_name || !phone_number) {
            return NextResponse.json(
                { error: 'Name and Phone Number are required' },
                { status: 400 }
            );
        }

        // Check if prisma is connected (runtime safety)
        try {
            const lead = await prisma.leads.create({
                data: {
                    full_name,
                    phone_number,
                    message: message || '',
                    status: 'pending'
                }
            });
            return NextResponse.json({ success: true, lead });
        } catch (dbError) {
            console.error('Database connection failed:', dbError);
            // Fallback for demo/development if DB offline
            return NextResponse.json({
                success: true,
                mock: true,
                message: 'Lead received (Mock Mode - DB Unreachable)'
            });
        }

    } catch (error) {
        console.error('Lead submission error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
