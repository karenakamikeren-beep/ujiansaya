-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS (Extended from Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  education_level TEXT CHECK (education_level IN ('SD', 'SMP', 'SMA', 'UTBK', 'CPNS', 'KEDINASAN')),
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  free_premium_used BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate referral code on user creation
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_referral_code ON public.users;
CREATE TRIGGER user_referral_code
BEFORE INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION generate_referral_code();

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral ON public.users(referral_code);

-- RLS Policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- USER SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_type TEXT CHECK (subscription_type IN ('monthly', 'yearly')),
  premium_start_date TIMESTAMPTZ,
  premium_end_date TIMESTAMPTZ,
  payment_id UUID,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON public.user_subscriptions(is_premium, premium_end_date);

-- RLS Policies for subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- USER DEVICES
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  ip_address INET,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, device_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON public.user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_active ON public.user_devices(user_id, is_active);

-- RLS for devices
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own devices" ON public.user_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices" ON public.user_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" ON public.user_devices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" ON public.user_devices
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- ADMINS
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL DEFAULT 'ADMIN',
  password_hash TEXT NOT NULL,
  full_name TEXT DEFAULT 'Administrator',
  email TEXT,
  last_login TIMESTAMPTZ,
  must_change_password BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);

-- Insert default admin with password: ADMIN (hashed with bcrypt)
INSERT INTO public.admins (username, password_hash, full_name, email)
VALUES ('ADMIN', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Super Admin', 'admin@tryout.com')
ON CONFLICT (username) DO NOTHING;

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

-- Auto-generate slug
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

CREATE INDEX IF NOT EXISTS idx_tryouts_slug ON public.tryouts(slug);
CREATE INDEX IF NOT EXISTS idx_tryouts_category ON public.tryouts(category);
CREATE INDEX IF NOT EXISTS idx_tryouts_active ON public.tryouts(is_active);
CREATE INDEX IF NOT EXISTS idx_tryouts_premium ON public.tryouts(is_premium);

-- RLS for tryouts (public read, admin write)
ALTER TABLE public.tryouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tryouts" ON public.tryouts
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

-- RLS for questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT USING (TRUE);

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

-- RLS for attempts
ALTER TABLE public.tryout_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts" ON public.tryout_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts" ON public.tryout_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts" ON public.tryout_attempts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view completed attempts for leaderboard" ON public.tryout_attempts
  FOR SELECT USING (is_completed = TRUE);

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

-- RLS for answers
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view answers for their attempts" ON public.answers
  FOR SELECT USING (
    attempt_id IN (
      SELECT id FROM public.tryout_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answers for their attempts" ON public.answers
  FOR INSERT WITH CHECK (
    attempt_id IN (
      SELECT id FROM public.tryout_attempts WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  transaction_id TEXT,
  gross_amount NUMERIC(10,2) NOT NULL,
  subscription_type TEXT CHECK (subscription_type IN ('monthly', 'yearly')),
  payment_type TEXT,
  transaction_status TEXT NOT NULL,
  payment_url TEXT,
  snap_token TEXT,
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  midtrans_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(transaction_status);

-- Add foreign key to subscriptions
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS fk_payment,
ADD CONSTRAINT fk_payment
FOREIGN KEY (payment_id) REFERENCES public.payments(id);

-- RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- REFERRALS
-- ============================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_amount NUMERIC(10,2) DEFAULT 5000,
  discount_amount NUMERIC(10,2) DEFAULT 2000,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);

-- RLS for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view referrals they made" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view referrals they received" ON public.referrals
  FOR SELECT USING (auth.uid() = referee_id);

-- ============================================
-- CERTIFICATES
-- ============================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID UNIQUE REFERENCES public.tryout_attempts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  downloaded_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_part TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  sequence_part := LPAD((
    SELECT COUNT(*) + 1 FROM public.certificates
    WHERE EXTRACT(YEAR FROM issued_at) = EXTRACT(YEAR FROM NOW())
  )::TEXT, 6, '0');
  
  RETURN 'CERT/' || year_part || '/' || sequence_part;
END;
$$ LANGUAGE plpgsql;

CREATE INDEX IF NOT EXISTS idx_certificates_attempt ON public.certificates(attempt_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);

-- RLS for certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- VOUCHERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_usage INTEGER,
  current_usage INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON public.vouchers(is_active, valid_until);

-- RLS for vouchers
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vouchers" ON public.vouchers
  FOR SELECT USING (is_active = TRUE AND (valid_until IS NULL OR valid_until > NOW()));

-- ============================================
-- VOUCHER USAGE
-- ============================================
CREATE TABLE IF NOT EXISTS public.voucher_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id),
  discount_amount NUMERIC(10,2),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(voucher_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_voucher_usage_voucher ON public.voucher_usage(voucher_id);
CREATE INDEX IF NOT EXISTS idx_voucher_usage_user ON public.voucher_usage(user_id);

-- RLS for voucher usage
ALTER TABLE public.voucher_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own voucher usage" ON public.voucher_usage
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.admins(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);

-- ============================================
-- EMAIL QUEUE
-- ============================================
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_status ON public.email_queue(status, created_at);

-- ============================================
-- AUTO CREATE USER PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
