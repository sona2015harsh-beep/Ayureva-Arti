-- Add new columns to live_classes
ALTER TABLE public.live_classes 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 100;
