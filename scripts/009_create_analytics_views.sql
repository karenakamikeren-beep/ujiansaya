-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- Overall platform statistics
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.users 
   WHERE id IN (
     SELECT user_id FROM public.user_subscriptions 
     WHERE is_premium = TRUE 
     AND (premium_end_date IS NULL OR premium_end_date > NOW())
   )) as premium_users,
  (SELECT COUNT(*) FROM public.users 
   WHERE has_completed_onboarding = TRUE) as onboarded_users,
  (SELECT COUNT(*) FROM public.tryout_attempts 
   WHERE DATE(created_at) = CURRENT_DATE) as attempts_today,
  (SELECT COUNT(*) FROM public.tryouts 
   WHERE is_active = TRUE) as active_tryouts,
  (SELECT SUM(gross_amount) FROM public.payments 
   WHERE transaction_status = 'settlement') as total_revenue;

-- Conversion funnel (free → premium)
CREATE OR REPLACE VIEW conversion_funnel AS
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN ta.id IS NOT NULL THEN u.id END) as users_attempted,
  COUNT(DISTINCT CASE WHEN us.is_premium THEN u.id END) as users_premium,
  ROUND(
    COUNT(DISTINCT CASE WHEN us.is_premium THEN u.id END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT u.id), 0) * 100, 
    2
  ) as conversion_rate_percent
FROM public.users u
LEFT JOIN public.tryout_attempts ta ON u.id = ta.user_id
LEFT JOIN public.user_subscriptions us ON u.id = us.user_id;

-- Top performers per category
CREATE OR REPLACE VIEW leaderboard_by_category AS
SELECT 
  t.category,
  t.title as tryout_title,
  u.full_name,
  u.id as user_id,
  us.is_premium,
  ta.score,
  ta.time_spent_seconds,
  ta.submitted_at,
  RANK() OVER (PARTITION BY t.id ORDER BY ta.score DESC, ta.time_spent_seconds ASC) as rank
FROM public.tryout_attempts ta
JOIN public.tryouts t ON ta.tryout_id = t.id
JOIN public.users u ON ta.user_id = u.id
LEFT JOIN public.user_subscriptions us ON u.id = us.user_id
WHERE ta.is_completed = TRUE
ORDER BY t.category, rank;

-- User weak topics analysis
CREATE OR REPLACE VIEW user_weak_topics AS
SELECT
  u.id as user_id,
  u.full_name,
  q.topic,
  COUNT(*) as total_questions,
  SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND(
    SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as accuracy_percent
FROM public.users u
JOIN public.tryout_attempts ta ON u.id = ta.user_id
JOIN public.answers a ON ta.id = a.attempt_id
JOIN public.questions q ON a.question_id = q.id
WHERE ta.is_completed = TRUE
  AND q.topic IS NOT NULL
GROUP BY u.id, u.full_name, q.topic
HAVING ROUND(
    SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) < 60
ORDER BY u.id, accuracy_percent ASC;
