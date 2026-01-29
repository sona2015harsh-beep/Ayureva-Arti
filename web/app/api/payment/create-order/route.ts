import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// Helper to initialize Razorpay (should use env vars)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

export async function POST(request: Request) {
    try {
        // 1. Verify Session
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await request.json();

        if (!courseId) {
            return NextResponse.json({ error: 'courseId required' }, { status: 400 });
        }

        const course = await prisma.courses.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Create Razorpay Order
        const options = {
            amount: course.price * 100, // Amount in paisa
            currency: "INR",
            receipt: `receipt_${profile.id}_${courseId.substring(0, 5)}`,
            notes: {
                courseId: courseId,
                userId: profile.id
            }
        };

        try {
            const order = await razorpay.orders.create(options);
            return NextResponse.json({
                id: order.id,
                currency: order.currency,
                amount: order.amount,
                key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
                courseTitle: course.title
            });
        } catch (rzpError) {
            console.error("Razorpay Error:", rzpError);
            // Fallback for dev mode
            if (process.env.NODE_ENV !== 'production') {
                return NextResponse.json({
                    id: `order_mock_${Date.now()}`,
                    currency: "INR",
                    amount: course.price * 100,
                    key_id: 'rzp_test_mock_key_id',
                    courseTitle: course.title,
                    isMock: true
                });
            }
            throw rzpError;
        }

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
