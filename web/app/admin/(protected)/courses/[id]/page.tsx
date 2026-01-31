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
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [unlockAt, setUnlockAt] = useState('');

    // Video Library State
    const [uploadMode, setUploadMode] = useState<'upload' | 'library'>('upload');
    const [libraryVideos, setLibraryVideos] = useState<any[]>([]);
    const [selectedLibraryId, setSelectedLibraryId] = useState('');

    // Fetch Library Videos once if needed
    const loadLibrary = async () => {
        if (libraryVideos.length > 0) return;
        const res = await fetch('/api/video-library');
        const data = await res.json();
        setLibraryVideos(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('/api/modules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    video_url: videoUrl, // Might be empty if using library ID, API handles it
                    video_library_id: selectedLibraryId,
                    course_id: courseId,
                    order_index: 1,
                    unlock_at: unlockAt ? new Date(unlockAt).toISOString() : null,
                    thumbnail_url: thumbnailUrl
                })
            });
            alert('Content Added!');
            setTitle('');
            setVideoUrl('');
            setThumbnailUrl('');
            setSelectedLibraryId('');
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

                    {/* Scheduled Thumbnail */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Thumbnail (Optional)
                        </label>
                        <div className="flex gap-4 items-center">
                            {thumbnailUrl && <img src={thumbnailUrl} className="w-16 h-10 object-cover rounded bg-gray-100" />}
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
                                    setLoading(true);
                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ filename: file.name, filetype: file.type })
                                        });
                                        const { uploadUrl } = await res.json();
                                        await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                                        setThumbnailUrl(uploadUrl.split('?')[0]);
                                    } finally { setLoading(false); }
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Override the default thumbnail for this scheduled class.
                        </p>
                    </div>

                    {/* Toggle Mode */}
                    <div className="flex bg-gray-100 dark:bg-zinc-700 p-1 rounded-lg mb-4">
                        <button
                            type="button"
                            onClick={() => setUploadMode('upload')}
                            className={`flex-1 py-1 px-3 rounded text-sm ${uploadMode === 'upload' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 dark:text-gray-300'
                                }`}
                        >
                            ⬆️ Upload New
                        </button>
                        <button
                            type="button"
                            onClick={() => { setUploadMode('library'); loadLibrary(); }}
                            className={`flex-1 py-1 px-3 rounded text-sm ${uploadMode === 'library' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 dark:text-gray-300'
                                }`}
                        >
                            📚 Select from Library
                        </button>
                    </div>

                    {uploadMode === 'upload' ? (
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
                                        const { uploadUrl } = await res.json();

                                        await fetch(uploadUrl, {
                                            method: 'PUT',
                                            body: file,
                                            headers: { 'Content-Type': file.type }
                                        });

                                        const s3Url = uploadUrl.split('?')[0];
                                        setVideoUrl(s3Url);
                                        // Also auto-add to library for future use? 
                                        // For now, let's keep them separate as per user request flow, 
                                        // or we could auto-add. Let's stick to the current "Upload" flow which is just for this module.
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
                    ) : (
                        <div>
                            <select
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                value={selectedLibraryId}
                                onChange={(e) => {
                                    const vidId = e.target.value;
                                    setSelectedLibraryId(vidId);
                                    const vid = libraryVideos.find(v => v.id === vidId);
                                    if (vid) {
                                        setVideoUrl(vid.video_url);
                                        setTitle(prev => prev || vid.title);
                                        setThumbnailUrl(vid.thumbnail_url || '');
                                    }
                                }}
                            >
                                <option value="">-- Select a Video --</option>
                                {libraryVideos.map((vid) => (
                                    <option key={vid.id} value={vid.id}>
                                        {vid.title} ({vid.duration ? `${Math.round(vid.duration / 60)}m` : 'Unknown duration'})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">
                                Selecting a video from the library reuses the same file. No new upload needed.
                            </p>
                        </div>
                    )}

                    <div className="text-xs text-gray-400">
                        Content Source: {selectedLibraryId ? 'Library Linked' : (videoUrl ? 'File Uploaded' : 'Waiting for content...')}
                    </div>

                    <button
                        disabled={loading || (!videoUrl && !selectedLibraryId)}
                        className="bg-orange-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Save Module'}
                    </button>
                </form>
            </div>
        </div>
    );
}
