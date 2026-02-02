import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/coupons/verify
// Body: { code, courseId (optional context) }
export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }

        const coupon = await prisma.coupons.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
        }

        // 1. Active Check
        if (!coupon.is_active) {
            return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 });
        }

        // 2. Expiry Check
        if (coupon.expiry_date && new Date() > coupon.expiry_date) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        // 3. Usage Limit Check
        if (coupon.usage_limit && (coupon.usage_count || 0) >= coupon.usage_limit) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        return NextResponse.json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discount_type,
            discountValue: coupon.discount_value,
            message: 'Coupon applied successfully'
        });

    } catch (error) {
        console.error('Verify coupon error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
