import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Try finding the patient and their full prescription timeline
    try {
      const patient = await prisma.patients.findUnique({
        where: { phone },
        include: {
          prescriptions: {
            orderBy: { consultation_date: 'desc' },
            include: {
              medicines: {
                orderBy: { display_order: 'asc' },
              },
              doctor: {
                select: {
                  name: true,
                  registration: true,
                },
              },
            },
          },
        },
      });

      if (!patient) {
        return NextResponse.json({ success: false, found: false });
      }

      return NextResponse.json({ success: true, found: true, patient });
    } catch (dbError) {
      console.error('Database connection failed on search:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Patient search error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
