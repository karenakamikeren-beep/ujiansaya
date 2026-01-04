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

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER subscriptions_updated_at 
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select_own" ON public.user_subscriptions;
CREATE POLICY "subscriptions_select_own" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- USER DEVICES (Anti Account Sharing)
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

-- Function to enforce 2-device limit
CREATE OR REPLACE FUNCTION enforce_device_limit()
RETURNS TRIGGER AS $$
DECLARE
  active_devices INTEGER;
BEGIN
  SELECT COUNT(*) INTO active_devices
  FROM public.user_devices
  WHERE user_id = NEW.user_id AND is_active = TRUE;
  
  IF active_devices >= 2 THEN
    RAISE EXCEPTION 'Maximum 2 active devices allowed. Please logout from another device.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS device_limit_check ON public.user_devices;
CREATE TRIGGER device_limit_check
BEFORE INSERT ON public.user_devices
FOR EACH ROW
EXECUTE FUNCTION enforce_device_limit();

-- Enable RLS
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "devices_select_own" ON public.user_devices;
CREATE POLICY "devices_select_own" ON public.user_devices
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "devices_insert_own" ON public.user_devices;
CREATE POLICY "devices_insert_own" ON public.user_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "devices_update_own" ON public.user_devices;
CREATE POLICY "devices_update_own" ON public.user_devices
  FOR UPDATE USING (auth.uid() = user_id);
