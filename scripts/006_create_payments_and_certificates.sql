-- ============================================
-- PAYMENTS (Midtrans Integration)
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

-- Add foreign key only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_payment'
  ) THEN
    ALTER TABLE public.user_subscriptions
    ADD CONSTRAINT fk_payment
    FOREIGN KEY (payment_id) REFERENCES public.payments(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

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

-- Auto-generate certificate number
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

-- Helper function to check premium status
CREATE OR REPLACE FUNCTION is_user_premium()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = auth.uid()
      AND is_premium = TRUE
      AND (premium_end_date IS NULL OR premium_end_date > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certificates_select_own" ON public.certificates;
CREATE POLICY "certificates_select_own" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "certificates_insert_passing" ON public.certificates;
CREATE POLICY "certificates_insert_passing" ON public.certificates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tryout_attempts ta
      JOIN public.tryouts t ON ta.tryout_id = t.id
      WHERE ta.id = attempt_id
        AND ta.user_id = auth.uid()
        AND ta.is_passed = TRUE
    )
    AND is_user_premium()
  );
