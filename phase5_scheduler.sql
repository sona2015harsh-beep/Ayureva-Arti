-- Add unlock_at column to videos table for Scheduled/Drip content
ALTER TABLE public.videos 
ADD COLUMN unlock_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.videos.unlock_at IS 'If set, video is locked until this time. If null, immediately available.';
