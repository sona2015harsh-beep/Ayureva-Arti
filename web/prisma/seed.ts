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

    console.log('Seeding complete!')
    console.log({ bams1, bams2, pg1 })
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
