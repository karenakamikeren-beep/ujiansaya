-- ============================================
-- TRYOUTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tryouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('SD', 'SMP', 'SMA', 'UTBK', 'CPNS', 'KEDINASAN')),
  duration_minutes INTEGER NOT NULL,
  passing_score INTEGER DEFAULT 60,
  is_premium BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  total_questions INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  average_score NUMERIC(5,2),
  created_by UUID REFERENCES public.admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tryout_slug ON public.tryouts;
CREATE TRIGGER tryout_slug
BEFORE INSERT OR UPDATE ON public.tryouts
FOR EACH ROW
EXECUTE FUNCTION generate_slug();

DROP TRIGGER IF EXISTS tryouts_updated_at ON public.tryouts;
CREATE TRIGGER tryouts_updated_at 
BEFORE UPDATE ON public.tryouts
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_tryouts_slug ON public.tryouts(slug);
CREATE INDEX IF NOT EXISTS idx_tryouts_category ON public.tryouts(category);
CREATE INDEX IF NOT EXISTS idx_tryouts_active ON public.tryouts(is_active);
CREATE INDEX IF NOT EXISTS idx_tryouts_premium ON public.tryouts(is_premium);

-- Enable RLS
ALTER TABLE public.tryouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tryouts_select_active" ON public.tryouts;
CREATE POLICY "tryouts_select_active" ON public.tryouts
  FOR SELECT USING (is_active = TRUE);

-- ============================================
-- QUESTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tryout_id UUID REFERENCES public.tryouts(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D','E')),
  explanation TEXT,
  explanation_image_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tryout_id, question_number)
);

CREATE INDEX IF NOT EXISTS idx_questions_tryout ON public.questions(tryout_id);
CREATE INDEX IF NOT EXISTS idx_questions_number ON public.questions(tryout_id, question_number);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "questions_select_authenticated" ON public.questions;
CREATE POLICY "questions_select_authenticated" ON public.questions
  FOR SELECT USING (auth.uid() IS NOT NULL);
