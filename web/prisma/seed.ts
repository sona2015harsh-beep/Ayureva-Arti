import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    console.log('Seeding database...')

    // Note: In the new Supabase schema, users are created via Supabase Auth
    // and profiles are auto-created by trigger. This seed only creates sample content.

    // 1. Create Sample Courses
    const bams1 = await prisma.courses.create({
        data: {
            title: 'Rachana Sharira: Human Anatomy',
            subtitle: 'First Year BAMS',
            description: 'Complete course on Human Anatomy for BAMS students',
            price: 349,
            thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1050&q=80',
            is_published: true,
            modules: {
                create: [
                    {
                        title: 'Module 1: Intro to Sharira',
                        order_index: 1,
                        videos: {
                            create: [
                                {
                                    title: 'Introduction to Human Anatomy',
                                    order_index: 1,
                                    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                                    is_free_preview: true
                                }
                            ]
                        }
                    },
                    {
                        title: 'Module 2: Asthi Sharira (Bones)',
                        order_index: 2,
                        videos: {
                            create: [
                                {
                                    title: 'Skeletal System Overview',
                                    order_index: 1,
                                    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                                    is_free_preview: false
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    const bams2 = await prisma.courses.create({
        data: {
            title: 'Dravyaguna Vigyan',
            subtitle: 'Second Year BAMS',
            description: 'Study of Ayurvedic Pharmacology',
            price: 349,
            thumbnail_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1050&q=80',
            is_published: true,
        }
    })

    const pg1 = await prisma.courses.create({
        data: {
            title: 'Advanced Kayachikitsa',
            subtitle: 'PG Course',
            description: 'Advanced internal medicine for postgraduates',
            price: 10000,
            thumbnail_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1050&q=80',
            is_published: true,
            modules: {
                create: [
                    {
                        title: 'Case Studies Discussion',
                        order_index: 1,
                        videos: {
                            create: [
                                {
                                    title: 'Patient Case Analysis',
                                    order_index: 1,
                                    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                                    is_free_preview: true
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    // 2. Seed Doctor
    const doctor = await prisma.doctors.upsert({
        where: { email: 'drartisingh1102@gmail.com' },
        update: {
            name: 'Dr. Arti Kumari',
            registration: 'Reg. No. 4200',
            specialization: 'Ayurvedic Medical Officer',
        },
        create: {
            id: 'd16c5b96-6e27-4a0b-85fa-7f8976f92026',
            name: 'Dr. Arti Kumari',
            registration: 'Reg. No. 4200',
            specialization: 'Ayurvedic Medical Officer',
            email: 'drartisingh1102@gmail.com',
        }
    })

    // 3. Seed Medicine Templates
    const t1 = await prisma.medicine_templates.upsert({
        where: { name: 'PCOS Standard Protocol' },
        update: {},
        create: {
            name: 'PCOS Standard Protocol',
            description: 'Standard protocol for regulating ovulation, dissolving cysts, and improving hormonal balance.',
            medicines: [
                { medicine_name: 'Arogyavardhini Vati', dosage: '1-0-1', timing: 'After Food', duration: '30 days' },
                { medicine_name: 'Kanchanar Guggulu', dosage: '1-0-1', timing: 'After Food', duration: '30 days' },
                { medicine_name: 'Rajapravartini Vati', dosage: '1-0-1', timing: 'After Food', duration: '15 days' },
                { medicine_name: 'Shatavari Churna', dosage: '0-0-1', timing: 'Night with Warm Water/Milk', duration: '30 days' },
            ]
        }
    })

    const t2 = await prisma.medicine_templates.upsert({
        where: { name: 'Thyroid / Hormonal Balance' },
        update: {},
        create: {
            name: 'Thyroid / Hormonal Balance',
            description: 'Helps regulate metabolic fire (Agni) and support thyroid health.',
            medicines: [
                { medicine_name: 'Kanchanar Guggulu', dosage: '1-0-1', timing: 'After Food', duration: '30 days' },
                { medicine_name: 'Triphala Churna', dosage: '0-0-1', timing: 'Night with Warm Water', duration: '30 days' },
                { medicine_name: 'Varunadi Kwath', dosage: '2-0-2', timing: 'Before Food (with equal warm water)', duration: '30 days' },
            ]
        }
    })

    const t3 = await prisma.medicine_templates.upsert({
        where: { name: 'UTI & Detox Protocol' },
        update: {},
        create: {
            name: 'UTI & Detox Protocol',
            description: 'For cooling Pitta dosha and flushing toxins from the urinary tract.',
            medicines: [
                { medicine_name: 'Chandraprabha Vati', dosage: '1-0-1', timing: 'After Food', duration: '15 days' },
                { medicine_name: 'Gokshuradi Guggulu', dosage: '1-0-1', timing: 'After Food', duration: '15 days' },
                { medicine_name: 'Punarnavarishta', dosage: '2-0-2', timing: 'After Food (with equal warm water)', duration: '15 days' },
            ]
        }
    })

    console.log('Seeding complete!')
    console.log({ bams1, bams2, pg1, doctor, t1, t2, t3 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
