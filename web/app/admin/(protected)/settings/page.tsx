import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Profile Information
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                        </label>
                        <div className="mt-1 text-gray-900 dark:text-white">
                            {user.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Role
                        </label>
                        <div className="mt-1 text-gray-900 dark:text-white">
                            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                Administrator
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
                <h2 className="mb-4 text-lg font-medium text-red-900 dark:text-red-400">
                    Account Actions
                </h2>

                <SettingsForm />
            </div>
        </div>
    )
}
