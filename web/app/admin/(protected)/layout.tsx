import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    // Verify Admin Role
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/admin/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700">
                <div className="p-6 flex justify-center">
                    <img
                        src="/icon.png"
                        alt="Ayureva Admin"
                        className="h-12 object-contain"
                    />
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <NavItem href="/admin" label="Dashboard" icon="📊" />
                    <NavItem href="/admin/courses" label="Manage Courses" icon="📚" />
                    <NavItem href="/admin/live-classes" label="Live Classes" icon="🎥" />
                    <NavItem href="/admin/video-library" label="Video Library" icon="📼" />
                    <NavItem href="/admin/users" label="Manage Users" icon="👥" />
                    <NavItem href="/admin/notifications" label="Announcements" icon="🔔" />
                    <NavItem href="/admin/settings" label="Settings" icon="⚙️" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-zinc-700 hover:text-orange-600 rounded-lg transition-colors"
        >
            <span>{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
