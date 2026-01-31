-- Phase 7: Add Thumbnail Support
-- Safely add thumbnail_url columns to existing tables

-- 1. Add to Video Library (Master Thumbnails)
ALTER TABLE public.video_library 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. Add to Videos (Session Thumbnails)
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 3. Add to Live Classes (Session Thumbnails)
ALTER TABLE public.live_classes 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 4. Notification (Optional, just to confirm success)
DO $$
BEGIN
    RAISE NOTICE 'Thumbnail columns added successfully';
END $$;
