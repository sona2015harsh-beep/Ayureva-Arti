import { createServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

// Verify Supabase session from Authorization header
export async function verifySession(request: Request) {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) return null

    try {
        const supabase = createServerClient()

        // Verify the JWT token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return null
        }

        // Get the profile from our database
        const profile = await prisma.profiles.findUnique({
            where: { id: user.id }
        })

        return profile
    } catch (error) {
        console.error('Session verification error:', error)
        return null
    }
}

// Check if user is admin
export async function verifyAdminSession(request: Request) {
    const profile = await verifySession(request)

    if (!profile || profile.role !== 'admin') {
        return null
    }

    return profile
}
