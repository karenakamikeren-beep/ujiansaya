-- Enable RLS for admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admins can view admin data
CREATE POLICY "Admins can view all admin data"
ON admins
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only service role can insert admins
CREATE POLICY "Service role can insert admins"
ON admins
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Admins can update their own data
CREATE POLICY "Admins can update their own data"
ON admins
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_tryout_attempts_user ON tryout_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_tryout_attempts_tryout ON tryout_attempts(tryout_id);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_questions_tryout ON questions(tryout_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
