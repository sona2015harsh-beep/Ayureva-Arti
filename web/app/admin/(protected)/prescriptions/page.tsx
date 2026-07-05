import { Metadata } from 'next';
import PrescriptionClient from './PrescriptionClient';

export const metadata: Metadata = {
  title: 'Digital Prescription Generator | Ayureva Admin',
  description: 'Bilingual prescription generator with WhatsApp integration and Patient CMS history.',
};

export default function PrescriptionMakerPage() {
  return <PrescriptionClient />;
}
