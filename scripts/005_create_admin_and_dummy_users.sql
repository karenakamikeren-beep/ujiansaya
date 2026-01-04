-- =============================================
-- CREATE ADMIN AND DUMMY USERS
-- =============================================
-- 
-- IMPORTANT: This script will FAIL because users table has foreign key to auth.users
-- Users MUST be created through Supabase Auth first (register at /auth/register)
-- 
-- After users register, you can run the subscription updates below
-- =============================================

-- First, ensure we have the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- CREATE ADMIN (This works because admins table is independent)
-- =============================================

INSERT INTO admins (
  id,
  username,
  email,
  full_name,
  password_hash,
  must_change_password,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'admin',
  'admin@tryoutpro.com',
  'Super Administrator',
  crypt('Admin123!', gen_salt('bf')),
  false,
  NOW(),
  NOW()
)
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- =============================================
-- MANUAL STEPS FOR TEST USERS
-- =============================================
-- 
-- Step 1: Register these users through the UI at /auth/register:
--   User 1: user1@gmail.com (password: user1)
--   User 2: user2@gmail.com (password: user2)
--
-- Step 2: After registration, run the queries below to give premium access
-- =============================================

-- After user1@gmail.com registers, run this to give premium:
/*
INSERT INTO user_subscriptions (
  id,
  user_id,
  status,
  plan_type,
  start_date,
  end_date,
  auto_renew
)
SELECT 
  gen_random_uuid(),
  id,
  'active',
  'yearly',
  NOW(),
  NOW() + INTERVAL '1 year',
  true
FROM auth.users 
WHERE email = 'user1@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  status = 'active',
  plan_type = 'yearly',
  start_date = NOW(),
  end_date = NOW() + INTERVAL '1 year';
*/

-- After user2@gmail.com registers, they will have free access by default (no action needed)

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check admin
SELECT 'Admin created:' as status, username, email, full_name 
FROM admins 
WHERE username = 'admin';

-- Check if users exist (run after registration)
/*
SELECT 'Users registered:' as status, email, created_at
FROM auth.users 
WHERE email IN ('user1@gmail.com', 'user2@gmail.com');
*/
