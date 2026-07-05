import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, Calendar, ShieldCheck, Heart } from 'lucide-react';
import PrintButton from './PrintButton';

interface VerificationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: VerificationPageProps) {
  const { id } = await params;
  const prescription = await prisma.prescriptions.findUnique({
    where: { id },
  });

  return {
    title: prescription
      ? `Prescription ${prescription.prescription_no} | Ayureva Digital`
      : 'Prescription | Ayureva',
    description: 'View and download your official Ayureva digital prescription.',
  };
}

export default async function PrescriptionVerificationPage({ params }: VerificationPageProps) {
  const { id } = await params;

  // Fetch complete prescription record with relations
  let prescription = null;
  try {
    prescription = await prisma.prescriptions.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        medicines: {
          orderBy: { display_order: 'asc' },
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Prescription Not Found</h1>
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

  const { patient, doctor, medicines } = prescription;

  // Render Page
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4 print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-lg rounded-3xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* Verification banner (Hidden during print) */}
        <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between text-xs font-bold print:hidden">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHENTIC DIGITAL PRESCRIPTION</span>
          </div>
          <PrintButton variant="header" label="Print / Save PDF" />
        </div>

        {/* Prescription Paper Layout */}
        <div className="p-8 md:p-12 font-sans text-gray-800 dark:text-zinc-200">
          {/* Clinic Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-green-800 pb-4 text-[11px] leading-tight text-gray-700 dark:text-zinc-350 font-medium">
            {/* Left Side: English */}
            <div className="col-span-5">
              <p className="font-bold text-sm text-green-950 dark:text-green-400 uppercase tracking-wide">DR. ARTI KUMARI</p>
              <p className="font-semibold italic text-gray-500 text-[10px]">(Medical officer)</p>
              <p className="mt-1">B.A.M.S (G.A.C.H Patna)</p>
              <p>C.R.I.T (N.M.C.H Patna)</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Reg. No.- 42</p>
            </div>

            {/* Center: Medical Symbol */}
            <div className="col-span-2 flex justify-center">
              <svg className="w-14 h-14" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 25C30 8 10 18 6 30C12 40 38 38 50 34Z" fill="#C87A82" stroke="#1A2A3A" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M50 25C38 15 22 22 20 29C22 36 38 34 50 34Z" fill="#D3ECEF" stroke="#1A2A3A" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M50 25C70 8 90 18 94 30C88 40 62 38 50 34Z" fill="#C87A82" stroke="#1A2A3A" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M50 25C62 15 78 22 80 29C78 36 62 34 50 34Z" fill="#D3ECEF" stroke="#1A2A3A" strokeWidth="1" strokeLinejoin="round"/>
                <rect x="48" y="22" width="4" height="88" rx="2" fill="#D4AF37" stroke="#1A2A3A" strokeWidth="1.2"/>
                <circle cx="50" cy="18" r="6" fill="#E5C158" stroke="#1A2A3A" strokeWidth="1.2"/>
                <path d="M50 32C55 32 62 38 62 44C62 50 48 52 38 56C28 60 28 66 38 72C48 78 62 80 62 86C62 92 48 94 38 98C28 102 28 108 38 114" stroke="#10633B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50 32C45 32 38 38 38 44C38 50 52 52 62 56C72 60 72 66 62 72C52 78 38 80 38 86C38 92 52 94 62 98C72 102 72 108 62 114" stroke="#10633B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="36" cy="42" r="2.5" fill="#10633B"/>
                <circle cx="64" cy="42" r="2.5" fill="#10633B"/>
              </svg>
            </div>

            {/* Right Side: Hindi */}
            <div className="col-span-5 text-right">
              <p className="font-bold text-sm text-green-950 dark:text-green-400 uppercase tracking-wide">डॉ. आरती कुमारी</p>
              <p className="font-semibold italic text-gray-500 text-[10px]">(चिकित्सा पदाधिकारी)</p>
              <p className="mt-1">बी.ए.एम.एस (जी.ए.सी.एच पटना)</p>
              <p>सी.आर.आई.टी (एन.एम.सी.एच पटना)</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Mob. No.- 9608855210</p>
            </div>
          </div>

          {/* Specializations Band */}
          <div className="bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-300 border-b border-red-200 dark:border-red-900/50 py-1.5 px-4 text-center text-[10px] font-bold tracking-wide">
            नोट: पेट, लीवर, फेफड़ा, किडनी, चर्म रोग, हड्डी रोग एवं स्त्री रोग संबंधित परामर्श
          </div>

          {/* Patient Info Grid */}
          <div className="grid grid-cols-12 gap-y-2.5 border-b border-green-800 py-4 text-[11px] text-gray-800 dark:text-zinc-300 font-semibold bg-gray-50/50 dark:bg-zinc-800/30 px-3 mt-3 rounded-xl">
            <div className="col-span-6">Patient Name: <span className="text-gray-900 dark:text-white font-bold">{patient.name}</span></div>
            <div className="col-span-3">Age: <span className="text-gray-900 dark:text-white font-bold">{patient.age || "—"} Years</span></div>
            <div className="col-span-3">Gender: <span className="text-gray-900 dark:text-white font-bold capitalize">{patient.gender || "—"}</span></div>
            
            <div className="col-span-6">Phone Number: <span className="text-gray-900 dark:text-white font-bold">{patient.phone}</span></div>
            <div className="col-span-3">Date: <span className="text-gray-900 dark:text-white font-bold">{new Date(prescription.consultation_date).toLocaleDateString("en-IN")}</span></div>
            <div className="col-span-3">Allergies: <span className="text-red-650 font-bold">{patient.allergies || "None"}</span></div>

            <div className="col-span-12 grid grid-cols-4 gap-2 border-t border-gray-100 dark:border-zinc-800 pt-2 text-[10px] text-gray-500 font-medium">
              <div>BP: <span className="text-gray-900 dark:text-zinc-300 font-bold">{prescription.blood_pressure || "—"}</span></div>
              <div>Pulse: <span className="text-gray-900 dark:text-zinc-300 font-bold">{prescription.pulse || "—"}</span></div>
              <div>Weight: <span className="text-gray-900 dark:text-zinc-300 font-bold">{prescription.weight || "—"}</span></div>
              <div>Temp: <span className="text-gray-900 dark:text-zinc-300 font-bold">{prescription.temperature || "—"}</span></div>
            </div>
          </div>

          {/* Chief Complaint & Diagnosis */}
          {(prescription.chief_complaint || prescription.diagnosis) && (
            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-zinc-800 py-3 text-xs leading-relaxed">
              {prescription.chief_complaint && (
                <div>
                  <span className="font-bold text-green-950 dark:text-green-400">Chief Complaints:</span>
                  <p className="text-gray-600 dark:text-zinc-400 mt-0.5">{prescription.chief_complaint}</p>
                </div>
              )}
              {prescription.diagnosis && (
                <div>
                  <span className="font-bold text-green-950 dark:text-green-400">Diagnosis:</span>
                  <p className="text-gray-600 dark:text-zinc-400 mt-0.5">{prescription.diagnosis}</p>
                </div>
              )}
            </div>
          )}

          {/* Rx Icon */}
          <div className="text-2xl font-serif font-black text-green-900 dark:text-green-500 my-4 select-none">Rx</div>

          {/* Medicines List Table */}
          <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-green-50 dark:bg-zinc-800 text-green-950 dark:text-zinc-300 font-bold border-b border-gray-200 dark:border-zinc-850">
                  <th className="px-4 py-2.5 w-12 text-center">S.No</th>
                  <th className="px-4 py-2.5">Medicine Name</th>
                  <th className="px-4 py-2.5">Dosage</th>
                  <th className="px-4 py-2.5">Timing</th>
                  <th className="px-4 py-2.5 w-24">Duration</th>
                  <th className="px-4 py-2.5">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {medicines.map((med, index) => (
                  <tr key={med.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-500 font-bold">{index + 1}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{med.medicine_name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 font-medium">{med.dosage}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 font-medium">{med.timing}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 font-semibold">{med.duration}</td>
                    <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-zinc-400 italic font-medium">{med.remarks || "As directed"}</td>
                  </tr>
                ))}
                {medicines.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">No medicines prescribed.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Extra Notes & Tests Advice */}
          {(prescription.doctor_notes || prescription.tests_advised) && (
            <div className="mt-6 space-y-4 border-t border-gray-100 dark:border-zinc-800 pt-4 text-xs">
              {prescription.tests_advised && (
                <div>
                  <span className="font-bold text-green-950 dark:text-green-400">Advised Investigation / Tests:</span>
                  <p className="text-gray-650 dark:text-zinc-400 mt-1 font-medium bg-zinc-50 dark:bg-zinc-800/20 p-2.5 rounded-lg border border-gray-150 dark:border-zinc-800">{prescription.tests_advised}</p>
                </div>
              )}
              {prescription.doctor_notes && (
                <div>
                  <span className="font-bold text-green-950 dark:text-green-400">Dietary & Lifestyle Advice (Pathyapathya):</span>
                  <p className="text-gray-650 dark:text-zinc-400 mt-1 font-medium bg-zinc-50 dark:bg-zinc-800/20 p-2.5 rounded-lg border border-gray-150 dark:border-zinc-800 whitespace-pre-line">{prescription.doctor_notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer & QR Code Section */}
          <div className="mt-10 pt-4 border-t border-green-800 flex justify-between items-end">
            
            {/* Dynamic QR Code */}
            <div className="text-[10px] text-gray-500 flex items-center gap-2.5">
              <img 
                src={`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(`https://www.ayureva.in/prescription/${prescription.id}`)}&choe=UTF-8`}
                alt="Verification QR Code" 
                className="w-14 h-14 border border-gray-200 dark:border-zinc-800 p-0.5 rounded bg-white object-contain"
              />
              <div>
                <p className="font-bold text-gray-800 dark:text-zinc-300 text-[9px] tracking-wide">VERIFIED CLINICAL RECORD</p>
                <p className="text-gray-400 text-[8px]">Scan to verify authenticity online</p>
                <p className="font-semibold text-green-700 dark:text-green-450 text-[8px] mt-0.5">
                  No: {prescription.prescription_no}
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="text-right text-[10px] text-gray-500 font-semibold leading-relaxed">
              {prescription.next_followup_date && (
                <div className="text-[10px] font-bold text-green-950 dark:text-green-300 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 px-3 py-1 rounded-lg flex items-center gap-1.5 mb-6 justify-end">
                  <Calendar className="w-3.5 h-3.5 text-green-700" />
                  <span>Next Consultation: {new Date(prescription.next_followup_date).toLocaleDateString("en-IN")}</span>
                </div>
              )}
              <div className="h-10"></div> {/* Space for signature */}
              <p className="border-t border-gray-200 dark:border-zinc-800 pt-1.5 w-40 ml-auto text-center font-bold text-gray-800 dark:text-zinc-350">
                Dr. Arti Kumari
              </p>
              <p className="text-center w-40 ml-auto text-[8px] text-gray-400">Authorized Signature</p>
            </div>
          </div>

        </div>
        
        {/* Floating Print CTA for Mobile Users */}
        <div className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-150 dark:border-zinc-800 px-6 py-4 flex justify-center print:hidden">
          <PrintButton variant="floating" label="Download / Print PDF Copy" />
        </div>

      </div>
    </div>
  );
}
