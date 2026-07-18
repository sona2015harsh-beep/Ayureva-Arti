import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all leads (with search & filters & timeline)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    // Build query filters
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (source && source !== 'all') {
      where.source = source;
    }
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { phone_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leadsList = await prisma.leads.findMany({
      where,
      include: {
        timeline: {
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(leadsList);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST new lead (from website forms)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, phone_number, message, source = 'google' } = body;

    if (!full_name || !phone_number) {
      return NextResponse.json(
        { error: 'Name and Phone Number are required' },
        { status: 400 }
      );
    }

    // Run in transaction to ensure lead and timeline are both logged
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.leads.create({
        data: {
          full_name,
          phone_number,
          message: message || '',
          status: 'new',
          source,
        },
      });

      await tx.lead_timeline.create({
        data: {
          lead_id: lead.id,
          status: 'new',
          note: 'Lead submitted via website contact form.',
        },
      });

      return lead;
    });

    return NextResponse.json({ success: true, lead: result });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH update lead details (status, notes, source, conversion timeline)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes, source, timelineEvent, recovery_status, payment_amount, payment_currency, payment_completed_at, recovered_by_email } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Fetch existing lead
      const existingLead = await tx.leads.findUnique({
        where: { id },
      });

      if (!existingLead) {
        throw new Error('Lead not found');
      }

      const dataToUpdate: any = {};
      if (notes !== undefined) dataToUpdate.notes = notes;
      if (source !== undefined) dataToUpdate.source = source;
      if (status !== undefined) dataToUpdate.status = status;
      if (recovery_status !== undefined) dataToUpdate.recovery_status = recovery_status;
      if (payment_amount !== undefined) dataToUpdate.payment_amount = payment_amount;
      if (payment_currency !== undefined) dataToUpdate.payment_currency = payment_currency;
      if (payment_completed_at !== undefined) dataToUpdate.payment_completed_at = payment_completed_at ? new Date(payment_completed_at) : null;
      if (recovered_by_email !== undefined) dataToUpdate.recovered_by_email = recovered_by_email;

      // Handle status transition timeline logging
      if (status && status !== existingLead.status) {
        await tx.lead_timeline.create({
          data: {
            lead_id: id,
            status,
            note: `Status updated from "${existingLead.status}" to "${status}".`,
          },
        });
      }

      // Add custom timeline text if provided
      if (timelineEvent) {
        await tx.lead_timeline.create({
          data: {
            lead_id: id,
            status: status || existingLead.status || 'new',
            note: timelineEvent,
          },
        });
      }

      // Handle CONVERTED status - link or create Patient automatically
      if (status === 'converted' && !existingLead.patient_id) {
        const cleanPhone = existingLead.phone_number.replace(/\D/g, '').slice(-10);

        // Check if patient exists by phone
        let patient = await tx.patients.findUnique({
          where: { phone: cleanPhone },
        });

        if (!patient) {
          patient = await tx.patients.create({
            data: {
              name: existingLead.full_name,
              phone: cleanPhone,
              allergies: 'None',
            },
          });
          await tx.lead_timeline.create({
            data: {
              lead_id: id,
              status: 'converted',
              note: `Patient record auto-created and linked (ID: ${patient.id}).`,
            },
          });
        } else {
          await tx.lead_timeline.create({
            data: {
              lead_id: id,
              status: 'converted',
              note: `Linked to existing Patient profile (ID: ${patient.id}).`,
            },
          });
        }

        dataToUpdate.patient_id = patient.id;
      }

      const updatedLead = await tx.leads.update({
        where: { id },
        data: dataToUpdate,
        include: {
          timeline: {
            orderBy: { created_at: 'desc' },
          },
        },
      });

      return updatedLead;
    });

    return NextResponse.json({ success: true, lead: result });
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
