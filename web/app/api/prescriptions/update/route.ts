import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id, // Prescription ID
      name,
      phone,
      age,
      gender,
      allergies,
      address,
      blood_group,
      visit_type,
      chief_complaint,
      diagnosis,
      blood_pressure,
      pulse,
      weight,
      temperature,
      doctor_notes,
      tests_advised,
      next_followup_date,
      medicines,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Prescription ID is required' }, { status: 400 });
    }

    // Run update in transaction
    const updatedPrescription = await prisma.$transaction(async (tx) => {
      // 1. Find or create patient
      let patient = await tx.patients.findFirst({
        where: { phone },
      });

      if (patient) {
        patient = await tx.patients.update({
          where: { id: patient.id },
          data: {
            name,
            age: age ? parseInt(age.toString()) : null,
            gender,
            allergies,
            address,
            blood_group,
          },
        });
      } else {
        patient = await tx.patients.create({
          data: {
            name,
            phone,
            age: age ? parseInt(age.toString()) : null,
            gender,
            allergies,
            address,
            blood_group,
          },
        });
      }

      // 2. Update prescription details
      const rx = await tx.prescriptions.update({
        where: { id },
        data: {
          patient_id: patient.id,
          consultation_date: new Date(),
          visit_type: visitTypeMapping(visit_type),
          chief_complaint,
          diagnosis,
          blood_pressure,
          pulse,
          weight,
          temperature,
          doctor_notes,
          tests_advised,
          next_followup_date: next_followup_date ? new Date(next_followup_date) : null,
        },
      });

      // 3. Delete existing medicines
      await tx.prescription_medicines.deleteMany({
        where: { prescription_id: id },
      });

      // 4. Insert new medicines list
      if (medicines && medicines.length > 0) {
        await tx.prescription_medicines.createMany({
          data: medicines.map((med: any, index: number) => ({
            prescription_id: id,
            medicine_name: med.medicine_name,
            dosage: med.dosage,
            timing: med.timing,
            duration: med.duration,
            remarks: med.remarks || '',
            display_order: index,
          })),
        });
      }

      // 5. Fetch completed prescription
      return await tx.prescriptions.findUnique({
        where: { id },
        include: {
          patient: true,
          medicines: {
            orderBy: { display_order: 'asc' },
          },
        },
      });
    });

    return NextResponse.json({ success: true, prescription: updatedPrescription });
  } catch (error) {
    console.error('Failed to update prescription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
}

// Helpers
function visitTypeMapping(type: string) {
  if (type === 'offline') return 'offline';
  return 'online';
}
