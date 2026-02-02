import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CallbackModal } from '@/components/CallbackModal';
import { CheckCircle2, Download, Smartphone, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Download Ayureva App | Best AIAPGT & BAMS Prep App',
    description: 'Master Ayurveda with Dr. Arti Singh. Access video lectures, mock tests, and live classes on your mobile. Download the Ayureva App now.',
};

export default function AppLandingPage() {
    const features = [
        "Comprehensive Video Lectures by Expert Faculty",
        "Real-time Live Classes & Doubt Sessions",
        "Smart Mock Tests with All India Ranking",
        "Offline Downloads for Seamless Learning",
        "Curated Study Materials & Notes",
        "Performance Analytics & Progress Tracking"
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white pt-16 pb-20 lg:pt-24 lg:pb-32">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Content Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
                                <Smartphone className="w-4 h-4" />
                                <span>#1 App for Ayurveda Aspirants</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold text-green-950 leading-tight mb-6">
                                Your Pocket <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Ayurveda Academy</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Prepare for AIAPGT & MO Exams, and strengthen any weak subject of your BAMS journey with India's most trusted faculty.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button size="lg" className="h-14 px-8 text-lg bg-green-700 hover:bg-green-800 shadow-lg shadow-green-900/20 w-full sm:w-auto">
                                    <Download className="mr-2 h-5 w-5" /> Download App
                                </Button>

                                <CallbackModal>
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 w-full sm:w-auto">
                                        Request Callback
                                    </Button>
                                </CallbackModal>
                            </div>

                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-1 text-yellow-500">
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <span className="ml-2 text-gray-900 font-bold">4.9/5 Rating</span>
                            </div>
                        </div>

                        {/* Mobile Mockup Area */}
                        <div className="flex-1 relative">
                            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                                <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800 relative">
                                    <Image
                                        src="/app-screenshot.jpg"
                                        alt="Ayureva App Screen"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute top-1/2 -right-4 md:-right-12 bg-white p-4 rounded-xl shadow-lg animate-bounce duration-1000">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">10k+ Students</p>
                                        <p className="text-xs text-gray-500">Trusted Community</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Rank #1</h2>
                        <p className="text-gray-600">The Ayureva App is built specifically for serious aspirants who want structured learning without distractions.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-xl border border-gray-100 bg-gray-50 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature}</h3>
                                <p className="text-gray-500 text-sm">Experience seamless learning designed for maximum retention.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-green-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-green-100 mb-8 max-w-2xl mx-auto">Join thousands of students and get access to the best Ayurveda content today.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto">
                            <Download className="mr-2 h-5 w-5" /> Install Now
                        </Button>
                        <CallbackModal>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto">
                                Talk to Counselor
                            </Button>
                        </CallbackModal>
                    </div>
                </div>
            </section>
        </div>
    );
}
