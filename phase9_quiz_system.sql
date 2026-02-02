-- Phase 9: Comprehensive Quiz System
-- Create 'quizzes' table and link questions/results to it

-- 1. Create 'quizzes' table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'VIDEO', 'MODULE', 'SUBJECT', 'MOCK'
    
    -- Context Links (Nullable, depends on type)
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    
    -- Configuration
    time_limit_minutes INTEGER, -- NULL for no limit
    passing_percentage INTEGER DEFAULT 70,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add 'quiz_id' to 'questions'
ALTER TABLE questions 
ADD COLUMN quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;

-- 3. Add 'quiz_id' to 'quiz_results'
ALTER TABLE quiz_results 
ADD COLUMN quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE;

-- 4. Create Policy helper to migrate existing data (Optional/Manual)
-- Note: Existing questions are linked to 'video_id'. We need to:
-- a) Create a 'quizzes' record for each video that has questions
-- b) Update the questions to point to that new quiz
-- c) Update results to point to that new quiz

DO $$
DECLARE
    video_rec RECORD;
    new_quiz_id UUID;
BEGIN
    FOR video_rec IN 
        SELECT DISTINCT video_id FROM questions WHERE quiz_id IS NULL
    LOOP
        -- Create a quiz for this video
        INSERT INTO quizzes (title, type, video_id, description)
        SELECT title, 'VIDEO', id, 'Quiz for ' || title
        FROM videos WHERE id = video_rec.video_id
        RETURNING id INTO new_quiz_id;

        -- Update questions
        UPDATE questions SET quiz_id = new_quiz_id WHERE video_id = video_rec.video_id;

        -- Update results
        UPDATE quiz_results SET quiz_id = new_quiz_id WHERE video_id = video_rec.video_id;
    END LOOP;
END $$;

-- 5. Cleanup (Wait for verification before dropping old columns)
-- ALTER TABLE questions DROP COLUMN video_id;
-- ALTER TABLE quiz_results DROP COLUMN video_id;
