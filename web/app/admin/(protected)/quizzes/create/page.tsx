'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateQuizPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'VIDEO', // Default
        video_id: '',
        module_id: '',
        course_id: '',
        time_limit_minutes: '',
        passing_percentage: 70
    });

    const isContextRequired = (type: string) => {
        // Simple helper to show/hide fields, though validation is loose
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin/quizzes');
            } else {
                const err = await res.json();
                alert('Error: ' + err.error);
            }
        } catch (error) {
            console.error(error);
            alert('An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/quizzes"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold dark:text-white">Create New Quiz</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Ayurveda Basics Module Quiz"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                        <textarea
                            className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what this quiz covers..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Quiz Type</label>
                            <select
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="VIDEO">Video Quiz</option>
                                <option value="MODULE">Module Quiz</option>
                                <option value="SUBJECT">Subject Test</option>
                                <option value="MOCK">Mock Test (Standalone)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Passing Score (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                value={formData.passing_percentage}
                                onChange={(e) => setFormData({ ...formData, passing_percentage: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Time Limit (Minutes)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Optional (Leave empty for no limit)"
                            className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                            value={formData.time_limit_minutes}
                            onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Context Fields (Conditional) */}
                <div className="pt-4 border-t dark:border-zinc-700">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Context Links (Optional IDs)</h3>

                    <div className="grid grid-cols-1 gap-4">
                        {formData.type === 'VIDEO' && (
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Details (Video ID)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white font-mono text-sm"
                                    placeholder="UUID of the video"
                                    value={formData.video_id}
                                    onChange={(e) => setFormData({ ...formData, video_id: e.target.value })}
                                />
                                <p className="text-xs text-gray-400 mt-1">Copy the ID from the Video Library.</p>
                            </div>
                        )}

                        {formData.type === 'MODULE' && (
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Details (Module ID)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white font-mono text-sm"
                                    placeholder="UUID of the module"
                                    value={formData.module_id}
                                    onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                                />
                            </div>
                        )}

                        {(formData.type === 'SUBJECT' || formData.type === 'MODULE') && (
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Details (Course ID)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white font-mono text-sm"
                                    placeholder="UUID of the course"
                                    value={formData.course_id}
                                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    );
}
