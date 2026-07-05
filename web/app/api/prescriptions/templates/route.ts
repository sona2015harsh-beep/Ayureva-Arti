import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    try {
      let templates = await prisma.medicine_templates.findMany();

      // Seed standard clinical protocols if empty
      if (templates.length === 0) {
        const standardTemplates = [
          {
            name: 'PCOS Standard Protocol',
            description: 'Standard protocol for regulating ovulation, dissolving cysts, and improving hormonal balance.',
            medicines: [
              { medicine_name: 'Arogyavardhini Vati', dosage: '1-0-1', timing: 'After Food', duration: '30 days' },
              { medicine_name: 'Kanchanar Guggulu', dosage: '1-0-1', timing: 'After Food', duration: '30 days' },
              { medicine_name: 'Rajapravartini Vati', dosage: '1-0-1', timing: 'After Food', duration: '15 days' },
              { medicine_name: 'Shatavari Churna', dosage: '0-0-1', timing: 'Night with Warm Water/Milk', duration: '30 days' },
            ],
          },
          {
            name: 'Thyroid / Hormonal Balance',
            description: 'Helps regulate metabolic fire (Agni) and support thyroid health.',
            medicines: [
              { medicine_name: 'Kanchanar Guggulu', dosage: '1-0-1', timing: 'After Food', duration: '30 days' },
              { medicine_name: 'Triphala Churna', dosage: '0-0-1', timing: 'Night with Warm Water', duration: '30 days' },
              { medicine_name: 'Varunadi Kwath', dosage: '2-0-2', timing: 'Before Food (with equal warm water)', duration: '30 days' },
            ],
          },
          {
            name: 'UTI & Detox Protocol',
            description: 'For cooling Pitta dosha and flushing toxins from the urinary tract.',
            medicines: [
              { medicine_name: 'Chandraprabha Vati', dosage: '1-0-1', timing: 'After Food', duration: '15 days' },
              { medicine_name: 'Gokshuradi Guggulu', dosage: '1-0-1', timing: 'After Food', duration: '15 days' },
              { medicine_name: 'Punarnavarishta', dosage: '2-0-2', timing: 'After Food (with equal warm water)', duration: '15 days' },
            ],
          },
        ];

        for (const t of standardTemplates) {
          await prisma.medicine_templates.create({
            data: {
              name: t.name,
              description: t.description,
              medicines: t.medicines,
            },
          });
        }

        templates = await prisma.medicine_templates.findMany();
      }

      return NextResponse.json({ success: true, templates });
    } catch (dbError) {
      console.error('Database connection failed on templates:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Templates fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
