-- Phase 10: Performance Optimization - Database Indexes
-- Purpose: Speed up common queries for fetching content and checking progress.

-- 1. Videos: Speed up fetching videos by module (Course Content Load)
CREATE INDEX IF NOT EXISTS idx_videos_module_id ON videos(module_id);
CREATE INDEX IF NOT EXISTS idx_videos_order_index ON videos(order_index);

-- 2. Modules: Speed up fetching modules by course (Course Detail Load)
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);

-- 3. Questions: Speed up quiz loading
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_video_id ON questions(video_id); -- For legacy queries

-- 4. Quiz Results: Speed up checking if a user validly completed a quiz
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_quiz ON quiz_results(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_video_user ON quiz_results(video_id, user_id); -- Legacy

-- 5. Video Progress: Speed up resume playback check
CREATE INDEX IF NOT EXISTS idx_video_progress_user_video ON video_progress(user_id, video_id);

-- 6. Quizzes: Speed up finding quizzes by context
CREATE INDEX IF NOT EXISTS idx_quizzes_video_id ON quizzes(video_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_type ON quizzes(type);
