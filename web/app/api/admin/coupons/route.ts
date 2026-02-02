import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/auth';

// GET /api/admin/coupons - List all coupons
export async function GET(request: Request) {
    try {
        const session = await verifySession(request);
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const coupons = await prisma.coupons.findMany({
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Fetch coupons error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/coupons - Create a new coupon
export async function POST(request: Request) {
    try {
        const session = await verifySession(request);
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code, discount_type, discount_value, expiry_date, usage_limit } = body;

        // Basic validation
        if (!code || !discount_type || !discount_value) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if code exists
        const existing = await prisma.coupons.findUnique({
            where: { code }
        });

        if (existing) {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
        }

        const coupon = await prisma.coupons.create({
            data: {
                code: code.toUpperCase(),
                discount_type, // 'PERCENTAGE' or 'FIXED'
                discount_value: parseInt(discount_value),
                expiry_date: expiry_date ? new Date(expiry_date) : null,
                usage_limit: usage_limit ? parseInt(usage_limit) : null,
                is_active: true
            }
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Create coupon error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/coupons?id=... - Deactivate/Delete coupon
export async function DELETE(request: Request) {
    try {
        const session = await verifySession(request);
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        // Technically we can hard delete or soft delete (set is_active=false)
        // Let's hard delete for cleanup unless it has usage history?
        // If it has usage, we should probably just deactivate. 
        // For now, let's just delete for simplicity as requested.

        await prisma.coupons.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete coupon error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
