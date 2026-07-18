import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      age,
      gender,
      dob,
      address,
      blood_group,
      allergies,
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

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Patient name and phone number are required' },
        { status: 400 }
      );
    }

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Upsert Patient
      const patient = await tx.patients.upsert({
        where: { phone },
        update: {
          name,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          dob: dob ? new Date(dob) : null,
          address: address || null,
          blood_group: blood_group || null,
          allergies: allergies || 'None',
        },
        create: {
          name,
          phone,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          dob: dob ? new Date(dob) : null,
          address: address || null,
          blood_group: blood_group || null,
          allergies: allergies || 'None',
        },
      });

      // 2. Find or Seed Doctor
      let doctor = await tx.doctors.findFirst();
      if (!doctor) {
        doctor = await tx.doctors.create({
          data: {
            id: 'd16c5b96-6e27-4a0b-85fa-7f8976f92026',
            name: 'Dr. Arti Kumari',
            registration: 'Reg. No. 4200',
            specialization: 'Ayurvedic Medical Officer',
            email: 'help@ayureva.in',
          },
        });
      }

      // 3. Generate sequential prescription number (e.g. AY-2026-000001)
      const count = await tx.prescriptions.count();
      const nextNo = (count + 1).toString().padStart(6, '0');
      const prescriptionNo = `AY-2026-${nextNo}`;

      // 4. Create Prescription
      const prescription = await tx.prescriptions.create({
        data: {
          prescription_no: prescriptionNo,
          patient_id: patient.id,
          doctor_id: doctor.id,
          visit_type: visit_type || 'online',
          consultation_date: new Date(),
          chief_complaint: chief_complaint || null,
          diagnosis: diagnosis || null,
          blood_pressure: blood_pressure || null,
          pulse: pulse || null,
          weight: weight || null,
          temperature: temperature || null,
          doctor_notes: doctor_notes || null,
          tests_advised: tests_advised || null,
          next_followup_date: next_followup_date ? new Date(next_followup_date) : null,
          status: 'active',
          created_by: 'Dr. Arti Kumari',
        },
      });

      // 5. Add Medicines
      if (medicines && Array.isArray(medicines) && medicines.length > 0) {
        await tx.prescription_medicines.createMany({
          data: medicines.map((m: any, idx: number) => ({
            prescription_id: prescription.id,
            medicine_name: m.medicine_name,
            dosage: m.dosage,
            timing: m.timing,
            duration: m.duration,
            remarks: m.remarks || '',
            display_order: idx,
          })),
        });
      }

      // Fetch full prescription details
      const fullPrescription = await tx.prescriptions.findUnique({
        where: { id: prescription.id },
        include: {
          patient: true,
          doctor: true,
          medicines: {
            orderBy: { display_order: 'asc' },
          },
        },
      });

      return fullPrescription;
    });

    return NextResponse.json({ success: true, prescription: result });
  } catch (error) {
    console.error('Prescription creation failed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
