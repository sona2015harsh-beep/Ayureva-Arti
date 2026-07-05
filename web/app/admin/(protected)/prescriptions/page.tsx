import { Suspense } from 'react';
import { Metadata } from 'next';
import PrescriptionClient from './PrescriptionClient';

export const metadata: Metadata = {
  title: 'Digital Prescription Generator | Ayureva Admin',
  description: 'Bilingual prescription generator with WhatsApp integration and Patient CMS history.',
};

export default function PrescriptionMakerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-550 font-semibold">Loading prescription builder...</div>}>
      <PrescriptionClient />
    </Suspense>
  );
}
