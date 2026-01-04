-- ============================================
-- TRYOUT ATTEMPTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tryout_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tryout_id UUID REFERENCES public.tryouts(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score NUMERIC(5,2),
  total_correct INTEGER DEFAULT 0,
  total_wrong INTEGER DEFAULT 0,
  total_unanswered INTEGER DEFAULT 0,
  total_questions INTEGER,
  time_spent_seconds INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  is_passed BOOLEAN,
  used_free_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON public.tryout_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_tryout ON public.tryout_attempts(tryout_id);
CREATE INDEX IF NOT EXISTS idx_attempts_completed ON public.tryout_attempts(is_completed);
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON public.tryout_attempts(tryout_id, score DESC, time_spent_seconds ASC);

-- Enable RLS
ALTER TABLE public.tryout_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attempts_select_own" ON public.tryout_attempts;
CREATE POLICY "attempts_select_own" ON public.tryout_attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempts_insert_own" ON public.tryout_attempts;
CREATE POLICY "attempts_insert_own" ON public.tryout_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempts_update_own" ON public.tryout_attempts;
CREATE POLICY "attempts_update_own" ON public.tryout_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- ANSWERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.tryout_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1) CHECK (selected_answer IN ('A','B','C','D','E')),
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_attempt ON public.answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON public.answers(question_id);

-- Enable RLS
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "answers_select_own" ON public.answers;
CREATE POLICY "answers_select_own" ON public.answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tryout_attempts
      WHERE tryout_attempts.id = answers.attempt_id
        AND tryout_attempts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "answers_insert_own" ON public.answers;
CREATE POLICY "answers_insert_own" ON public.answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tryout_attempts
      WHERE tryout_attempts.id = answers.attempt_id
        AND tryout_attempts.user_id = auth.uid()
    )
  );

-- Update tryout statistics on attempt completion
CREATE OR REPLACE FUNCTION update_tryout_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = TRUE AND (OLD.is_completed = FALSE OR OLD.is_completed IS NULL) THEN
    UPDATE public.tryouts
    SET 
      total_attempts = total_attempts + 1,
      average_score = (
        SELECT AVG(score)
        FROM public.tryout_attempts
        WHERE tryout_id = NEW.tryout_id AND is_completed = TRUE
      )
    WHERE id = NEW.tryout_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_stats_on_completion ON public.tryout_attempts;
CREATE TRIGGER update_stats_on_completion
AFTER UPDATE ON public.tryout_attempts
FOR EACH ROW
EXECUTE FUNCTION update_tryout_stats();
