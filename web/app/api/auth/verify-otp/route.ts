import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { phone, otp } = await request.json();

        // With Supabase, phone OTP verification is handled by Supabase Auth
        // This endpoint is for verifying the OTP that Supabase sends

        const supabase = createServerClient();

        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token: otp,
            type: 'sms'
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        // Get or create profile
        let profile = await prisma.profiles.findUnique({
            where: { id: data.user!.id }
        });

        if (!profile) {
            // Profile should be created by trigger, but fallback
            profile = await prisma.profiles.create({
                data: {
                    id: data.user!.id,
                    email: data.user!.email,
                    role: 'student'
                }
            });
        }

        return NextResponse.json({
            user: {
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                role: profile.role
            },
            session: {
                access_token: data.session!.access_token,
                refresh_token: data.session!.refresh_token
            }
        });

    } catch (error) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
