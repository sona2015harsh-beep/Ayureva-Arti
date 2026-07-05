import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VerificationPageProps {
  params: Promise<{
    id: string;
  }>;
}

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(part.length - 1);
    })
    .join(' ');
}

export async function generateMetadata({ params }: VerificationPageProps) {
  const { id } = await params;
  const prescription = await prisma.prescriptions.findUnique({
    where: { id },
  });

  return {
    title: prescription
      ? `Verify Prescription ${prescription.prescription_no} | Ayureva Authenticity`
      : 'Verify Prescription | Ayureva',
    description: 'Secure, privacy-preserving digital prescription verification seal for Ayureva patients.',
  };
}

export default async function PrescriptionVerificationPage({ params }: VerificationPageProps) {
  const { id } = await params;

  // Fetch prescription record
  let prescription = null;
  try {
    prescription = await prisma.prescriptions.findUnique({
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
            specialization: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Database connection failed on verification route:', error);
  }

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Prescription</h1>
          <p className="text-gray-500 mb-6">
            This verification link is invalid or has expired. If you suspect fraud, please contact Ayureva support.
          </p>
          <Link href="/">
            <span className="text-green-700 font-bold hover:underline">Back to Ayureva Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 py-12">
      <div className="max-w-lg w-full bg-white p-8 md:p-10 rounded-3xl border border-green-100 shadow-md relative overflow-hidden">
        {/* Verification watermark */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-green-50 rounded-full flex items-center justify-center opacity-30">
          <ShieldCheck className="w-24 h-24 text-green-600" />
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Authenticity Verified
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-3">Prescription Record Verified</h1>
          <p className="text-gray-500 text-sm mt-1">This medical consultation record is official and authentic.</p>
        </div>

        <div className="border-t border-b border-gray-100 py-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Prescription Number:</span>
            <span className="text-gray-900 font-bold tracking-wide">{prescription.prescription_no}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Patient Name (Masked):</span>
            <span className="text-gray-900 font-bold">{maskName(prescription.patient.name)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Consulting Doctor:</span>
            <span className="text-gray-900 font-bold">{prescription.doctor.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Medical Registration:</span>
            <span className="text-gray-900 font-bold">{prescription.doctor.registration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Consultation Date:</span>
            <span className="text-gray-900 font-bold">
              {new Date(prescription.consultation_date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Status:</span>
            <span className="text-green-700 font-extrabold flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE / AUTHENTIC
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 leading-relaxed max-w-sm mx-auto font-medium">
          <p>
            For patient privacy, detailed clinical diagnosis, complaints, and medicines are not displayed publicly.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Ayureva. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
