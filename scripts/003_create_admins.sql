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

-- Insert default admin (password: ADMIN123)
-- Hash generated with bcrypt, cost=10
INSERT INTO public.admins (username, password_hash, full_name, email)
VALUES (
  'ADMIN',
  '$2a$10$YourBcryptHashHere',
  'Super Admin',
  'admin@tryoutpro.com'
)
ON CONFLICT (username) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);

DROP TRIGGER IF EXISTS admins_updated_at ON public.admins;
CREATE TRIGGER admins_updated_at 
BEFORE UPDATE ON public.admins
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();
