import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(part.length - 1);
    })
    .join(' ');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Prescription ID is required' },
        { status: 400 }
      );
    }

    try {
      const prescription = await prisma.prescriptions.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              name: true,
            },
          },
          doctor: {
            select: {
              name: true,
              registration: true,
            },
          },
        },
      });

      if (!prescription) {
        return NextResponse.json(
          { valid: false, error: 'Prescription not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        valid: true,
        prescription_no: prescription.prescription_no,
        patient_masked_name: maskName(prescription.patient.name),
        doctor_name: prescription.doctor.name,
        doctor_registration: prescription.doctor.registration,
        consultation_date: prescription.consultation_date,
        status: prescription.status === 'active' ? 'VERIFIED & ACTIVE' : 'CANCELLED',
      });
    } catch (dbError) {
      console.error('Database connection failed on verification:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Verification API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
