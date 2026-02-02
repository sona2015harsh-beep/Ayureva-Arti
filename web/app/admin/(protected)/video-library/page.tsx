'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function VideoLibraryPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            const res = await fetch('/api/video-library');
            const data = await res.json();
            if (Array.isArray(data)) setVideos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Thumbnail Prompt
        // In a real app we'd have a separate file input, but for simplicity let's prompt or ask for a separate upload.
        // Actually, let's just make the UI better. We can't easily do it in a single "onChange" of a file input.
        // Let's defer this to a proper modal form. 
        // But to keep it simple, I will modify the UI to open a modal that has TWO inputs.
    };

    const handleUploadVideo = async (videoFile: File, thumbFile: File | null) => {
        setIsUploading(true);
        try {
            // 1. Video Upload
            const vidRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: videoFile.name, filetype: videoFile.type })
            });
            const { uploadUrl: vidUrl, key: vidKey } = await vidRes.json();
            await fetch(vidUrl, { method: 'PUT', body: videoFile, headers: { 'Content-Type': videoFile.type } });
            const s3VideoUrl = vidUrl.split('?')[0];

            // 2. Thumbnail Upload (Optional)
            let s3ThumbUrl = null;
            if (thumbFile) {
                const thumbRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: thumbFile.name, filetype: thumbFile.type })
                });
                const { uploadUrl: tUrl } = await thumbRes.json();
                await fetch(tUrl, { method: 'PUT', body: thumbFile, headers: { 'Content-Type': thumbFile.type } });
                s3ThumbUrl = tUrl.split('?')[0];
            }

            // 3. Add to Library Database
            await fetch('/api/video-library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: videoFile.name.replace(/\.[^/.]+$/, ""),
                    filename: videoFile.name,
                    video_url: s3VideoUrl,
                    thumbnail_url: s3ThumbUrl,
                    size_bytes: videoFile.size,
                    duration: 0
                })
            });

            alert('Upload Successful!');
            setShowUploadModal(false);
            loadVideos();
        } catch (error) {
            console.error(error);
            alert('Upload Failed');
        } finally {
            setIsUploading(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredVideos = import('react').useMemo(() => {
        if (!searchQuery) return videos;
        const lower = searchQuery.toLowerCase();
        return videos.filter(v =>
            v.title.toLowerCase().includes(lower) ||
            v.filename.toLowerCase().includes(lower)
        );
    }, [videos, searchQuery]);

    // ... handleUpload ...

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Video Library</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 md:w-64 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition whitespace-nowrap"
                    >
                        + Upload New Video
                    </button>
                </div>
            </div>

            {/* Upload Modal ... (kept same) */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload to Library</h2>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const vidFile = (form.elements.namedItem('video') as HTMLInputElement).files?.[0];
                            const thumbFile = (form.elements.namedItem('thumbnail') as HTMLInputElement).files?.[0];
                            if (vidFile) handleUploadVideo(vidFile, thumbFile || null);
                        }} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Video File (Required)</label>
                                <input name="video" type="file" accept="video/*" required className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-orange-50 file:text-orange-700
                                    hover:file:bg-orange-100 dark:file:bg-zinc-700 dark:file:text-orange-400" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Thumbnail Image (Optional)</label>
                                <input name="thumbnail" type="file" accept="image/*" className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-gray-50 file:text-gray-700
                                    hover:file:bg-gray-100 dark:file:bg-zinc-700 dark:file:text-gray-300" />
                                <p className="text-xs text-gray-500 mt-1">Displayed to students before unlocking.</p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button disabled={isUploading} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50">
                                    {isUploading ? 'Uploading...' : 'Start Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="p-4">Video Title</th>
                            <th className="p-4">Filename</th>
                            <th className="p-4">Size</th>
                            <th className="p-4">Uploaded At</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading library...</td></tr>
                        ) : filteredVideos.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No videos found.</td></tr>
                        ) : (
                            filteredVideos.map((vid) => (
                                <VideoRow key={vid.id} video={vid} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { memo } from 'react';

const VideoRow = memo(({ video }: { video: any }) => {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
            <td className="p-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                    {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt="" className="w-16 h-10 object-cover rounded bg-gray-200" />
                    ) : (
                        <div className="w-16 h-10 bg-gray-100 dark:bg-zinc-600 rounded flex items-center justify-center text-xl">🎥</div>
                    )}
                    <span className="truncate max-w-[200px]">{video.title}</span>
                </div>
            </td>
            <td className="p-4 text-gray-600 dark:text-gray-300 text-sm font-mono">{video.filename}</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">{(video.size_bytes / (1024 * 1024)).toFixed(1)} MB</td>
            <td className="p-4 text-gray-600 dark:text-gray-300">
                {format(new Date(video.created_at), 'MMM d, yyyy')}
            </td>
            <td className="p-4 text-right">
                <button
                    onClick={async () => {
                        try {
                            const res = await fetch('/api/video/sign-url', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ key: video.video_url })
                            });
                            const { url } = await res.json();
                            window.open(url, '_blank');
                        } catch (e) {
                            alert('Failed to load preview');
                        }
                    }}
                    className="text-blue-600 hover:underline mr-3"
                >
                    Preview
                </button>
            </td>
        </tr>
    );
});
VideoRow.displayName = 'VideoRow';
