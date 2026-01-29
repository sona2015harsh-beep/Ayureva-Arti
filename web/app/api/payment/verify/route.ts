import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await request.json();

        // Get user from session
        const profile = await verifySession(request);
        if (!profile) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verification Logic
        const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret';

        let isValid = false;

        if (razorpay_order_id.startsWith('order_mock_')) {
            isValid = true; // Mock order is always valid for dev
        } else {
            const generated_signature = crypto
                .createHmac('sha256', secret)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest('hex');

            if (generated_signature === razorpay_signature) {
                isValid = true;
            }
        }

        if (isValid) {
            // Get course to get price
            const course = await prisma.courses.findUnique({
                where: { id: courseId }
            });

            // ACTIVATE ENROLLMENT
            const enrollment = await prisma.enrollments.create({
                data: {
                    user_id: profile.id,
                    course_id: courseId,
                    payment_id: razorpay_payment_id,
                    amount_paid: course?.price
                }
            });

            return NextResponse.json({ status: 'success', enrollment });
        } else {
            return NextResponse.json({ error: 'Invalid Payment Signature' }, { status: 400 });
        }

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
