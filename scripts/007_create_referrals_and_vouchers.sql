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

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals_select_own" ON public.referrals;
CREATE POLICY "referrals_select_own" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

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
