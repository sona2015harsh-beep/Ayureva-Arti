import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, event_type, page_path, metadata } = body;

    if (!session_id || !event_type || !page_path) {
      return NextResponse.json({ error: 'Missing required tracking parameters' }, { status: 400 });
    }

    const event = await prisma.funnel_events.create({
      data: {
        session_id,
        event_type,
        page_path,
        metadata: metadata || {},
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Failed to log funnel event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
