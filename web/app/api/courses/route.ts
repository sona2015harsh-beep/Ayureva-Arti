import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const courses = await prisma.courses.findMany({
            where: { is_published: true },
            include: {
                modules: {
                    orderBy: { order_index: 'asc' },
                    include: {
                        videos: {
                            orderBy: { order_index: 'asc' }
                        }
                    }
                },
                instructor: true
            },
            orderBy: { title: 'asc' }
        });

        return NextResponse.json(courses, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
            }
        });
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, subtitle, description, price, thumbnail_url, instructor_id } = await request.json();

        if (!title || price === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const course = await prisma.courses.create({
            data: {
                title,
                subtitle,
                description,
                price: parseFloat(price),
                thumbnail_url,
                instructor_id,
                is_published: true // Auto publish for MVP
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error('Failed to create course:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
