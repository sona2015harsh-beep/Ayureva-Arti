'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Leaf, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Full reload to ensure Middleware sees the new session cookie immediately
            window.location.href = '/admin'
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/20">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-1 ring-green-400/30">
                        <Leaf className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Ayureva Admin
                    </h2>
                    <p className="mt-2 text-sm text-green-200">
                        Secure access for administrators
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-400" />
                            {error}
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-green-200/50 group-focus-within:text-green-400 transition-colors" />
                            </div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border-0 bg-white/5 py-3.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 transition-all"
                                placeholder="Admin Email"
                            />
                        </div>
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-green-200/50 group-focus-within:text-green-400 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border-0 bg-white/5 py-3.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-green-400 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-green-200" />
                            ) : (
                                <Lock className="h-5 w-5 text-green-200 group-hover:text-green-100" />
                            )}
                        </span>
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        {!loading && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-5 w-5 text-green-100" />
                            </span>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-green-200/40">
                            Protected by Ayureva Secure Gateway
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
