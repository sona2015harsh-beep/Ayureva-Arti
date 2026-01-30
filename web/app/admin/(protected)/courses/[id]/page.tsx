'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = use(params);
    return <ClientCourseManager courseId={courseId} />;
}

function ClientCourseManager({ courseId }: { courseId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [unlockAt, setUnlockAt] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('/api/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    video_url: videoUrl,
                    course_id: courseId,
                    order_index: 1,
                    unlock_at: unlockAt ? new Date(unlockAt).toISOString() : null,
                })
            });
            alert('Content Added!');
            setTitle('');
            setVideoUrl('');
            setUnlockAt('');
            router.refresh();
        } catch (e) {
            alert('Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Manage Content</h2>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm mb-8">
                <h3 className="text-lg font-bold mb-4">Add New Module (Video)</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full border dark:border-zinc-600 dark:bg-zinc-700 p-2 rounded"
                        placeholder="Module Title (e.g., Chapter 1)"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />

                    {/* Scheduled Release for Hybrid/Batch Courses */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Available From (Optional - For Hybrid Batch)
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                            value={unlockAt}
                            onChange={e => setUnlockAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Leave blank for immediate access (Recorded Course). Set a time for Automated Unlock.
                        </p>
                    </div>

                    {/* File Upload UI */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setLoading(true);
                                try {
                                    const res = await fetch('/api/upload', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            filename: file.name,
                                            filetype: file.type
                                        })
                                    });
                                    const { uploadUrl, key } = await res.json();

                                    await fetch(uploadUrl, {
                                        method: 'PUT',
                                        body: file,
                                        headers: { 'Content-Type': file.type }
                                    });

                                    const s3Url = uploadUrl.split('?')[0];
                                    setVideoUrl(s3Url);
                                    alert('Upload Complete!');
                                } catch (err) {
                                    console.error(err);
                                    alert('Upload Failed');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Select video to upload</p>
                    </div>

                    <div className="text-xs text-gray-400">
                        Video URL: {videoUrl || 'Waiting for upload...'}
                    </div>

                    <button
                        disabled={loading || !videoUrl}
                        className="bg-orange-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Save Module'}
                    </button>
                </form>
            </div>
        </div>
    );
}
