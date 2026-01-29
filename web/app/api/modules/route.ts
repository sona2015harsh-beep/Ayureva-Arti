import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { title, course_id, order_index } = await request.json();

        if (!title || !course_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create a module (was chapter)
        const module = await prisma.modules.create({
            data: {
                title,
                course_id,
                order_index: order_index || 1
            }
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error('Failed to create module:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
