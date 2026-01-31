-- Phase 6: Video Library Pattern
-- Create central repository for videos
CREATE TABLE IF NOT EXISTS public.video_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER,
    size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add reference to videos table (lessons)
ALTER TABLE public.videos 
ADD COLUMN video_library_id UUID REFERENCES public.video_library(id);

-- Add index for faster lookups
CREATE INDEX idx_videos_library_id ON public.videos(video_library_id);
