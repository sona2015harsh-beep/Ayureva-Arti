import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // HARD REDIRECT for APK (Internal Hosting)
    const pathname = request.nextUrl.pathname
    if (pathname === '/app' || pathname === '/download') {
        return NextResponse.redirect(new URL('/app-release.apk', request.url))
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // PROTECTED ROUTE CHECK
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude login page from protection to avoid loop
        if (request.nextUrl.pathname === '/admin/login') {
            // If already logged in, redirect to admin dashboard
            if (user) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return response
        }

        // Checking if user is not logged in
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return response
}
