"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Award,
  Users,
  Stethoscope,
  Heart,
  Shield,
  CheckCircle,
  Calendar,
  BookOpen,
  GraduationCap,
  Hospital,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useAnalytics } from "@/lib/analytics"

export default function AboutPageClient() {
  const { trackConsultationClick } = useAnalytics()

  const handleHeroConsultationClick = () => {
    trackConsultationClick("about_hero", "primary_cta")
  }

  const handleCTAConsultationClick = () => {
    trackConsultationClick("about_cta", "primary_cta")
  }

  const handleCTAServicesClick = () => {
    trackConsultationClick("about_cta", "secondary_cta")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">About Dr. Arti Singh</Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                India's Most Trusted <span className="text-green-600">Ayurvedic Women's Health Specialist</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Dr. Arti Singh, BAMS qualified Ayurvedic doctor, combines traditional Ayurvedic wisdom with modern
                medical knowledge to provide the best treatment for PCOS, PCOD, menstrual disorders, and comprehensive
                women's healthcare. Online consultations available worldwide.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleHeroConsultationClick}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Consultation Today
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/dr-arti-singh.jpg"
                  alt="Dr. Arti Singh - Best Ayurvedic Doctor in Patna for PCOS PCOD Treatment"
                  width={800}
                  height={800}
                  className="rounded-2xl shadow-2xl object-cover"
                  quality={100}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Meet Dr. Arti Singh - Leading Ayurvedic Specialist
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Dr. Arti Singh is a dedicated BAMS (Bachelor of Ayurvedic Medicine and Surgery) practitioner and the
                most trusted Ayurvedic women's health specialist in India. Currently serving as a Medical Officer
                under the Government of Bihar, she brings extensive public healthcare experience along with
                comprehensive clinical training from prestigious institutions including NMCH. Dr. Arti uniquely
                blends traditional Ayurvedic wisdom and modern medical knowledge to provide the best treatment for
                PCOS, PCOD, menstrual disorders, and complete women's healthcare.
              </p>
            </div>

            <div className="mb-12">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Her specialized expertise in treating hormonal disorders like PCOS, PCOD, menstrual irregularities, and
                fertility issues has made her the go-to Ayurvedic doctor for women's health problems. Dr. Arti's
                evidence-based approach combines ancient healing principles with modern diagnostic methods to address
                the root causes of health issues, ensuring safe, natural, and lasting results for all her patients.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                What sets Dr. Arti Singh apart as one of the best Ayurvedic doctors is her commitment to personalized
                care. She believes in treating each patient as an individual, understanding their unique constitution
                (Prakriti), lifestyle, and health goals to create customized treatment plans that deliver optimal
                results. Her compassionate approach and deep knowledge have helped hundreds of women achieve hormonal
                balance and optimal health naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications & Experience */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dr. Arti Singh's Qualifications & Medical Training
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive medical education and specialized clinical training in both traditional Ayurveda and modern
              healthcare systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">BAMS Degree</CardTitle>
                <CardDescription>Bachelor of Ayurvedic Medicine & Surgery</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Comprehensive 5.5-year program covering traditional Ayurvedic principles, modern medical sciences, and
                  clinical practice
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hospital className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Clinical Training</CardTitle>
                <CardDescription>NMCH Patna & Leading Medical Institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Extensive hands-on clinical experience in both Ayurvedic and Allopathic treatment methodologies at top
                  hospitals
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Dual Medical Expertise</CardTitle>
                <CardDescription>Ayurvedic & Modern Medicine Knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Unique combination of traditional Ayurvedic healing wisdom and modern medical diagnostic capabilities
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-lg">Women's Health Specialization</CardTitle>
                <CardDescription>Expert in Female Reproductive Health</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Specialized focus on PCOS, PCOD, menstrual disorders, fertility, and comprehensive women's wellness
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Medical Officer</CardTitle>
                <CardDescription>Bihar Government Healthcare Services</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Currently serving as a Medical Officer under the Government of Bihar, providing quality healthcare services to the community
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Treatment Philosophy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/ayurvedic-clinic.png"
                alt="Ayurvedic Treatment Philosophy at Ayureva Clinic Patna"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg"
              />
            </div>

            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Treatment Philosophy</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Dr. Arti Singh's Holistic Healing Approach</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Root Cause Treatment</h3>
                    <p className="text-gray-600">
                      Focus on identifying and addressing the underlying causes of PCOS, PCOD, and women's health issues
                      rather than just managing symptoms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Ayurvedic Care</h3>
                    <p className="text-gray-600">
                      Every treatment plan is customized based on individual constitution (Prakriti), current health
                      status, symptoms, and lifestyle factors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrative Medicine Approach</h3>
                    <p className="text-gray-600">
                      Combining the best of traditional Ayurvedic wisdom with modern medical insights for comprehensive
                      women's healthcare.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Education & Empowerment</h3>
                    <p className="text-gray-600">
                      Empowering women with knowledge about their health and providing practical tools for self-care and
                      long-term wellness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dr. Arti Singh's Areas of Specialization</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert Ayurvedic treatment for women's health issues, PCOS, PCOD, and comprehensive wellness solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>PCOS & PCOD Treatment</CardTitle>
                <CardDescription>
                  Expert Ayurvedic treatment for PCOS, PCOD, hormonal imbalances, and related fertility issues affecting
                  women
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Menstrual Disorders</CardTitle>
                <CardDescription>
                  Specialized treatment for irregular periods, heavy bleeding, painful menstruation, and comprehensive
                  reproductive health care
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Ayurvedic Lifestyle Medicine</CardTitle>
                <CardDescription>
                  Personalized diet, nutrition, fitness guidance, and lifestyle modifications for optimal women's health
                  and wellness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Preventive Healthcare</CardTitle>
                <CardDescription>
                  Comprehensive health screening, risk assessment, and preventive strategies for long-term women's
                  wellness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Fertility & Reproductive Health</CardTitle>
                <CardDescription>
                  Natural fertility enhancement, preconception care, and comprehensive reproductive health support for
                  women
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Chronic Disease Management</CardTitle>
                <CardDescription>
                  Ayurvedic support for diabetes, thyroid disorders, hypertension, and other chronic health conditions
                  in women
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-green-200 p-8">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  To provide accessible, personalized, and effective Ayurvedic healthcare solutions for women worldwide
                  that honor the wisdom of traditional medicine while embracing modern medical advancements. We are
                  committed to empowering women to take charge of their health and achieve optimal wellness through
                  natural, holistic approaches.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 p-8">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  To be the most trusted Ayurvedic healthcare provider that bridges the gap between traditional healing
                  and modern medicine, creating a healthier world where every woman has access to comprehensive,
                  compassionate, and effective healthcare that addresses her unique needs and supports her journey to
                  optimal health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Natural Healing Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience personalized Ayurvedic care with Dr. Arti Singh, India's most trusted women's health specialist.
            Schedule your consultation today and take the first step towards optimal health and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={handleCTAConsultationClick}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                onClick={handleCTAServicesClick}
              >
                Explore Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}
