import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Simulate creation
        return NextResponse.json({
            message: 'User created successfully',
            user: {
                id: 'new-user-id',
                ...body
            }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
    }
}
