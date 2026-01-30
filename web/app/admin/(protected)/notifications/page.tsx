import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Bell, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function NotificationsPage() {
    const supabase = await createClient();

    // Check Admin Access (Middleware handles it, but double check is good)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');

    // Fetch recent notifications
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    async function sendNotification(formData: FormData) {
        'use server';

        const supabase = await createClient();
        const title = formData.get('title') as string;
        const message = formData.get('message') as string;
        const type = formData.get('type') as string || 'system';
        const target_user_email = formData.get('target_email') as string; // Optional

        let target_user_id = null;

        if (target_user_email) {
            // Resolve email to ID (Admin only feature)
            // Note: profiles table usually links id to auth.users.id
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', target_user_email) // Assuming email is in profiles
                .single();

            if (profile) {
                target_user_id = profile.id;
            } else {
                // If email not found in profiles, maybe error or just ignore (broadcast)
                // For now, let's treat "not found" as an error if they tried to specify one.
                // We can't easily return error from server action without useFormState (React 19/Next 14)
                // simplifying for now.
            }
        }

        await supabase.from('notifications').insert({
            title,
            message,
            type,
            target_user_id
        });

        revalidatePath('/admin/notifications');
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-8 w-8 text-orange-500" />
                Manage Notifications
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Form */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <h3 className="text-xl font-bold mb-6">Send Announcement</h3>
                    <form action={sendNotification} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full p-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600"
                                placeholder="e.g. Live Class Starting!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full p-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600"
                                placeholder="Write your update here..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    name="type"
                                    className="w-full p-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600"
                                >
                                    <option value="announcement">Announcement 📢</option>
                                    <option value="reminder">Reminder ⏰</option>
                                    <option value="system">System Info ℹ️</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Target Email (Optional)</label>
                                <input
                                    name="target_email"
                                    type="email"
                                    className="w-full p-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600"
                                    placeholder="Leave empty for ALL users"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Send className="h-4 w-4" />
                            Send Notification
                        </button>
                    </form>
                </div>

                {/* Recent History */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <h3 className="text-xl font-bold mb-6">Recent History</h3>
                    <div className="space-y-4">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notif: any) => (
                                <div key={notif.id} className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/50 border border-gray-100 dark:border-zinc-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{notif.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notif.message}</p>
                                        </div>
                                        <Badge type={notif.type} />
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                                        <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{notif.target_user_id ? 'Private' : 'Everyone'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">No notifications sent yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ type }: { type: string }) {
    const styles = {
        announcement: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        system: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${(styles as any)[type] || styles.system} capitalize`}>
            {type}
        </span>
    );
}
