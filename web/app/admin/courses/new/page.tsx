'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCourse() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'BAMS',
        subject: '',
        thumbnail: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin/courses');
                router.refresh();
            } else {
                alert('Failed to create course');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm">
                <div>
                    <label className="block text-sm font-medium mb-1">Course Title</label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="BAMS">BAMS</option>
                            <option value="PG">PG / AIAPGT</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                        required
                        type="number"
                        className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full px-4 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600 h-32"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
}
