'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SettingsForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignOut = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900"
        >
            {loading ? 'Signing out...' : 'Sign Out'}
        </button>
    )
}
