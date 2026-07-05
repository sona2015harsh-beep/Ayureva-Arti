import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prescriptions = await prisma.prescriptions.findMany({
      include: {
        patient: true,
        medicines: {
          orderBy: { display_order: 'asc' },
        },
      },
      orderBy: {
        consultation_date: 'desc',
      },
    });

    return NextResponse.json({ success: true, prescriptions });
  } catch (error) {
    console.error('Failed to fetch prescriptions list:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prescriptions list' },
      { status: 500 }
    );
  }
}
