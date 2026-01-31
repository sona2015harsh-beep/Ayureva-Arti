'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';

export default function AdminLiveClasses() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [classes, setClasses] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course_id: '',
        scheduled_at: '',
        duration_minutes: 60,
        max_participants: 100,
        thumbnail_url: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);

        // Fetch live_classes
        const { data: classesData, error } = await supabase
            .from('live_classes')
            .select(`
        *,
        course:courses(title),
        instructor:profiles!instructor_id(full_name)
      `)
            .order('scheduled_at', { ascending: false });

        // Fetch courses for dropdown
        const { data: coursesData } = await supabase
            .from('courses')
            .select('id, title')
            .eq('is_published', true);

        if (classesData) setClasses(classesData);
        if (coursesData) setCourses(coursesData);
        setIsLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        // Generate unique room ID
        const roomName = `AyurevaLive_${Date.now()}`;

        const { error } = await supabase.from('live_classes').insert({
            title: formData.title,
            description: formData.description || null,
            course_id: formData.course_id || null, // Handle empty string
            scheduled_at: new Date(formData.scheduled_at).toISOString(),
            duration_minutes: formData.duration_minutes,
            max_participants: formData.max_participants,
            instructor_id: userData.user.id, // Current admin as instructor
            jitsi_room_id: roomName,
            thumbnail_url: formData.thumbnail_url || null,
            is_active: false, // Not active yet
        });

        if (!error) {
            setShowCreateModal(false);
            setShowCreateModal(false);
            setFormData({
                title: '',
                description: '',
                course_id: '',
                scheduled_at: '',
                duration_minutes: 60,
                max_participants: 100,
                thumbnail_url: ''
            });
            loadData();
        } else {
            alert('Error creating class: ' + error.message);
        }
    };

    const toggleActive = async (classId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('live_classes')
            .update({ is_active: !currentStatus })
            .eq('id', classId);

        if (!error) loadData();
    };

    const startClass = (roomName: string, classId: string) => {
        // Set active
        toggleActive(classId, false); // Actually set to true (toggle flips it)

        // Open Jitsi in new tab
        const user = {
            displayName: 'Instructor (Host)',
            email: 'instructor@ayureva.in'
        };

        const params = new URLSearchParams({
            'userInfo.displayName': user.displayName,
            'userInfo.email': user.email,
        });

        window.open(`https://meet.jit.si/${roomName}#${params.toString()}`, '_blank');
    };

    const handleDelete = async (classId: string) => {
        if (!confirm('Are you sure you want to delete this scheduled class?')) return;

        const { error } = await supabase
            .from('live_classes')
            .delete()
            .eq('id', classId);

        if (!error) loadData();
    };

    if (isLoading) return <div className="p-8">Loading classes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Live Classes</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                    + Schedule New Class
                </button>
            </div>

            {/* Class List */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Scheduled For</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                        {classes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No live classes scheduled.
                                </td>
                            </tr>
                        ) : (
                            classes.map((cls) => (
                                <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            {cls.thumbnail_url ? (
                                                <img src={cls.thumbnail_url} className="w-12 h-12 rounded object-cover bg-gray-100" alt="" />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-purple-100 flex items-center justify-center text-lg">📹</div>
                                            )}
                                            {cls.title}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {cls.course?.title || 'General'}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {format(new Date(cls.scheduled_at), 'MMM d, yyyy h:mm a')}
                                        <div className="text-xs text-gray-400">
                                            ({cls.duration_minutes} mins)
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${cls.is_active
                                                ? 'bg-red-100 text-red-700 animate-pulse'
                                                : new Date(cls.scheduled_at) < new Date()
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {cls.is_active
                                                ? '🔴 LIVE NOW'
                                                : new Date(cls.scheduled_at) < new Date()
                                                    ? 'Completed'
                                                    : 'Scheduled'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {/* Start Button */}
                                        <button
                                            onClick={() => startClass(cls.jitsi_room_id, cls.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                                        >
                                            {cls.is_active ? 'Rejoin Class' : 'Start Class'}
                                        </button>

                                        {/* Toggle Active (for debugging mainly) */}
                                        <button
                                            onClick={() => toggleActive(cls.id, cls.is_active)}
                                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                                        >
                                            {cls.is_active ? 'End' : 'Set Active'}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(cls.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Schedule Live Class</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Class Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                    rows={3}
                                    placeholder="Agenda or details about the class..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Max Participants</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                        value={formData.max_participants}
                                        onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Course (Optional)</label>
                                <select
                                    className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                    value={formData.course_id}
                                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Class Thumbnail (Optional)</label>
                                <div className="flex gap-4 items-center">
                                    {formData.thumbnail_url && (
                                        <img src={formData.thumbnail_url} className="w-16 h-10 object-cover rounded bg-gray-100" alt="Preview" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-gray-50 file:text-gray-700
                                            hover:file:bg-gray-100 dark:file:bg-zinc-700 dark:file:text-gray-300"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setIsUploading(true);
                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ filename: file.name, filetype: file.type })
                                                });
                                                const { uploadUrl } = await res.json();
                                                await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                                                setFormData(prev => ({ ...prev, thumbnail_url: uploadUrl.split('?')[0] }));
                                            } catch (err) {
                                                console.error(err);
                                                alert('Upload failed');
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                        value={formData.scheduled_at}
                                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Duration (mins)</label>
                                    <input
                                        type="number"
                                        required
                                        min="15"
                                        step="15"
                                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                        value={formData.duration_minutes}
                                        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t dark:border-zinc-700">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-zinc-700 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                >
                                    Schedule Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
