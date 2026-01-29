"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Award, Star, CheckCircle, Leaf, Calendar, Stethoscope } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useAnalytics } from "@/lib/analytics"

export default function ClientPage() {
  const { trackConsultationClick, trackServiceInterest } = useAnalytics()

  const handleHeroConsultationClick = () => {
    trackConsultationClick("hero_section", "primary_cta")
  }

  const handleAboutConsultationClick = () => {
    trackConsultationClick("about_section", "secondary_cta")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                Trusted by Patients in 15+ Countries & Across India
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                India's Leading Ayurvedic Expert for <span className="text-green-600">PCOS & Global Women's Health</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Dr. Arti Singh (BAMS) provides world-class natural treatment for PCOS, infertility, and hormonal issues.
                Expert online video consultations available for patients across India, USA, UK, and Worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleHeroConsultationClick}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Free Consultation
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span>BAMS Qualified Doctor</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span>Natural & Safe Treatment</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/dr-arti-singh.jpg"
                  alt="Dr. Arti Singh - Best Ayurvedic Doctor for PCOS PCOD Treatment"
                  width={800}
                  height={800}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                  quality={100}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              India's Leading Ayurvedic Women's Health Specialist
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of ancient Ayurvedic wisdom and modern medical understanding for women's
              health issues
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Natural Ayurvedic Treatment</h3>
              <p className="text-gray-600">
                Safe, natural, and effective Ayurvedic treatment for PCOS, PCOD, and menstrual disorders without harmful
                side effects.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Treatment Plans</h3>
              <p className="text-gray-600">
                Every treatment plan is customized based on your unique constitution, symptoms, and health goals for
                best results.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Root Cause Treatment</h3>
              <p className="text-gray-600">
                We address underlying causes of hormonal imbalances and women's health issues for lasting wellness
                transformation.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All Our Treatments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Our Specializations</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Ayurvedic Women's Health Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized Ayurvedic treatments for PCOS, PCOD, menstrual disorders, fertility, and complete women's
              wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              className="border-2 hover:border-green-200 transition-colors group"
              onClick={() => trackServiceInterest("PCOS_PCOD_Treatment")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">PCOS & PCOD Ayurvedic Treatment</CardTitle>
                <CardDescription>
                  Natural Ayurvedic approach to manage PCOS/PCOD, restore hormonal balance and improve fertility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Hormonal balance restoration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural weight management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Fertility enhancement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:border-green-200 transition-colors group"
              onClick={() => trackServiceInterest("Menstrual_Disorders_Treatment")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Menstrual Disorders Treatment</CardTitle>
                <CardDescription>
                  Expert Ayurvedic treatment for irregular periods, painful menstruation, and menstrual cycle disorders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Menstrual cycle regulation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Period pain management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    PMS & PMDD relief
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:border-green-200 transition-colors group"
              onClick={() => trackServiceInterest("Womens_Health_Wellness")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Women's Health & Wellness</CardTitle>
                <CardDescription>
                  Comprehensive Ayurvedic health assessment and preventive care for women's overall well-being
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Complete health screening
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Preventive healthcare
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Lifestyle counseling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:border-green-200 transition-colors group"
              onClick={() => trackServiceInterest("Ayurvedic_Diet_Nutrition")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Ayurvedic Diet & Nutrition</CardTitle>
                <CardDescription>
                  Personalized Ayurvedic nutrition plans for weight management, PCOS, and overall health improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Custom Ayurvedic meal plans
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural weight management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Digestive health improvement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:border-green-200 transition-colors group"
              onClick={() => trackServiceInterest("Yoga_Fitness_Therapy")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Yoga & Fitness Therapy</CardTitle>
                <CardDescription>
                  Therapeutic yoga and fitness guidance for PCOS, hormonal balance, and women's health improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Therapeutic yoga for PCOS
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Customized exercise plans
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Stress management techniques
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="border-2 hover:border-green-200 transition-colors group"
              onClick={() => trackServiceInterest("Fertility_Reproductive_Health")}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Fertility & Reproductive Health</CardTitle>
                <CardDescription>
                  Natural Ayurvedic fertility enhancement and reproductive health support for women planning pregnancy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural fertility enhancement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Preconception care
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Reproductive health optimization
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/ayurvedic-clinic.png"
                alt="Ayurvedic Treatment Setup at Our Clinic in Patna"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg"
              />
            </div>

            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">About Dr. Arti Singh</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Trusted Ayurvedic Women's Health Specialist
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dr. Arti Singh is a highly qualified BAMS (Bachelor of Ayurvedic Medicine and Surgery) practitioner and
                a leading Ayurvedic women's health specialist. With extensive clinical training at prestigious
                institutions including NMCH, she combines traditional Ayurvedic wisdom with modern medical knowledge to
                provide the best treatment for PCOS, PCOD, and women's health issues.
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Her specialized expertise in treating hormonal disorders like PCOS, PCOD, menstrual irregularities, and
                fertility issues has helped hundreds of women achieve optimal health naturally. Dr. Arti's
                evidence-based Ayurvedic approach ensures safe, effective, and lasting results for all patients.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">BAMS Qualified</h4>
                    <p className="text-gray-600 text-sm">Ayurvedic Medicine & Surgery Specialist</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Stethoscope className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Dual Medical Expertise</h4>
                    <p className="text-gray-600 text-sm">Ayurvedic & Modern Medicine Knowledge</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Clinical Training</h4>
                    <p className="text-gray-600 text-sm">NMCH Patna & Leading Medical Institutions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Women's Health Expert</h4>
                    <p className="text-gray-600 text-sm">Specialized in Female Reproductive Health</p>
                  </div>
                </div>
              </div>

              <Link href="/about">
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleAboutConsultationClick}>
                  Learn More About Dr. Arti Singh
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Patient Success Stories</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say About Our Treatment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real success stories from women who overcame PCOS, PCOD, and menstrual disorders with our Ayurvedic
              treatment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  "Dr. Arti Singh completely cured my PCOS naturally. Her personalized approach and deep knowledge of
                  both Ayurveda and modern medicine gave me confidence. Highly recommend for women's health issues."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold">P</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Priya S.</p>
                    <p className="text-sm text-gray-600">PCOS Treatment Success</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  "Best Ayurvedic clinic for women's health! Dr. Arti's treatment for my irregular periods was amazing.
                  She explains everything clearly and the natural approach worked better than allopathic medicines. Very
                  satisfied."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anita M.</p>
                    <p className="text-sm text-gray-600">Menstrual Disorder Treatment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  "Dr. Arti Singh helped me conceive naturally after years of trying! Her Ayurvedic fertility treatment
                  and personalized diet plan worked wonders. I recommend every woman to visit for natural and safe
                  treatment."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">R</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ritu K.</p>
                    <p className="text-sm text-gray-600">Fertility Treatment Success</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


    </div>
  )
}
