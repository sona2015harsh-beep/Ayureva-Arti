"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Calendar,
  Stethoscope,
  Leaf,
  Users,
  Shield,
  Brain,
  Baby,
  Flower2,
  Activity,
  Apple,
  Dumbbell,
  CheckCircle,
} from "lucide-react"

import Link from "next/link"
import { useAnalytics } from "@/lib/analytics"

export default function ServicesPageClient() {
  const { trackConsultationClick, trackServiceInterest } = useAnalytics()

  const handleConsultationClick = () => {
    trackConsultationClick("services_cta", "primary_cta")
  }

  const handleAboutClick = () => {
    trackConsultationClick("services_cta", "secondary_cta")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Our Ayurvedic Services</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Complete Ayurvedic Women's Health Services</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Dr. Arti Singh offers comprehensive Ayurvedic treatments for PCOS, PCOD, menstrual disorders, fertility,
            diet & nutrition, and complete women's wellness solutions. Online consultations available worldwide.
          </p>
        </div>
      </section>

      {/* Women's Health Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialized Ayurvedic Women's Health Treatments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert Ayurvedic solutions for PCOS, PCOD, menstrual problems, and female reproductive health issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">PCOS & PCOD Ayurvedic Treatment</CardTitle>
                <CardDescription>
                  Best natural Ayurvedic treatment for PCOS/PCOD. Restore hormonal balance and improve fertility without
                  side effects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural hormonal balance restoration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Insulin resistance management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Weight management support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural fertility enhancement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Menstrual Disorders Treatment</CardTitle>
                <CardDescription>
                  Expert Ayurvedic treatment for irregular periods, heavy bleeding, painful menstruation, and all
                  menstrual cycle disorders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Menstrual cycle regulation therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Dysmenorrhea (period pain) treatment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    PMS & PMDD natural management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Amenorrhea treatment
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                  <Baby className="w-6 h-6 text-rose-600" />
                </div>
                <CardTitle className="text-xl">Natural Fertility & Conception Treatment</CardTitle>
                <CardDescription>
                  Ayurvedic fertility enhancement and preconception care for natural pregnancy planning and reproductive
                  health.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural fertility optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Ovulation support therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Preconception counseling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Reproductive health assessment
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Flower2 className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Menopause Management</CardTitle>
                <CardDescription>
                  Natural Ayurvedic support for menopausal transition and hormone replacement alternatives for women's
                  health.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Hot flush natural relief
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Mood stabilization therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Bone health support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Sleep quality improvement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Endometriosis & Fibroids Treatment</CardTitle>
                <CardDescription>
                  Ayurvedic management of endometriosis, uterine fibroids, and related pelvic conditions with natural
                  healing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural pain management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Inflammation reduction therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Hormonal regulation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Quality of life improvement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Thyroid Disorders Ayurvedic Treatment</CardTitle>
                <CardDescription>
                  Natural management of hypothyroidism, hyperthyroidism, and thyroid-related health issues affecting
                  women.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Thyroid function optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Metabolism regulation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Energy level improvement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Weight management support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">UTI & Urinary Health Treatment</CardTitle>
                <CardDescription>
                  Natural Ayurvedic treatment for urinary tract infections, recurrent UTI, and comprehensive urinary
                  health support for women.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Recurrent UTI prevention
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Natural infection treatment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Urinary system strengthening
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Bladder health improvement
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Health & Wellness Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Health & Wellness Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete Ayurvedic wellness programs for optimal health, preventive care, and lifestyle improvement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Complete Health Assessment</CardTitle>
                <CardDescription>
                  Comprehensive Ayurvedic health evaluation and personalized wellness planning.
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
                    Prakriti (constitution) analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Lifestyle assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Preventive care planning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Detoxification Programs</CardTitle>
                <CardDescription>
                  Panchakarma and modern detox therapies for body purification and rejuvenation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Panchakarma therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Liver detoxification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Digestive cleansing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Rejuvenation therapy
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Stress & Mental Wellness</CardTitle>
                <CardDescription>
                  Holistic Ayurvedic approach to stress management, anxiety relief, and mental health support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Stress management techniques
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Anxiety & depression support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Sleep disorder treatment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Meditation & mindfulness
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Chronic Disease Management</CardTitle>
                <CardDescription>
                  Ayurvedic support for diabetes, hypertension, arthritis, and other chronic conditions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Diabetes management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Blood pressure control
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Arthritis pain relief
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Autoimmune support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Immunity Building</CardTitle>
                <CardDescription>
                  Natural immunity enhancement and disease prevention through Ayurvedic principles and lifestyle
                  changes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Immune system strengthening
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Seasonal wellness programs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Respiratory health support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Allergy management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="text-xl">Anti-Aging & Longevity</CardTitle>
                <CardDescription>
                  Rasayana therapy and anti-aging treatments for healthy aging and longevity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Rasayana (rejuvenation) therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Skin health improvement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Cognitive enhancement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Vitality restoration
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fitness & Diet Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ayurvedic Diet & Fitness Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalized Ayurvedic diet and fitness programs for PCOS, weight management, and overall health
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Personalized Ayurvedic Nutrition</CardTitle>
                <CardDescription>
                  Custom Ayurvedic diet plans for PCOS, weight management, and health based on your constitution and
                  health goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Prakriti-based meal planning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Therapeutic diet protocols
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Seasonal eating guidelines
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Nutritional counseling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Natural Weight Management</CardTitle>
                <CardDescription>
                  Holistic Ayurvedic approach to healthy weight loss and weight gain for PCOS and health through natural
                  methods.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Sustainable weight loss
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Healthy weight gain
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Metabolism optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Body composition improvement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Dumbbell className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Yoga & Exercise Therapy</CardTitle>
                <CardDescription>
                  Customized yoga sequences and exercise programs for PCOS, hormonal balance, and specific health needs.
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
                    Pranayama (breathing) techniques
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Strength training guidance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Flexibility improvement
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Digestive Health</CardTitle>
                <CardDescription>
                  Comprehensive digestive wellness programs and gut health optimization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Agni (digestive fire) enhancement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    IBS & IBD management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Gut microbiome support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Food sensitivity testing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                  <Leaf className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Sports Nutrition</CardTitle>
                <CardDescription>
                  Specialized Ayurvedic nutrition and fitness guidance for athletes and active individuals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Performance optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Recovery enhancement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Injury prevention
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Endurance building
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Lifestyle Coaching</CardTitle>
                <CardDescription>
                  Comprehensive Ayurvedic lifestyle modification programs for sustainable health improvements and
                  wellness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Daily routine optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Habit formation support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Work-life balance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Wellness goal setting
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Natural Healing Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Take the first step towards optimal health with Dr. Arti Singh's personalized Ayurvedic treatments for PCOS,
            PCOD, and wellness. Online consultations available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" onClick={handleConsultationClick}>
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                onClick={handleAboutClick}
              >
                Learn More About Dr. Arti Singh
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}
