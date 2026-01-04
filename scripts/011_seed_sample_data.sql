-- ============================================
-- SEED SAMPLE DATA
-- ============================================

-- Insert sample tryouts
INSERT INTO public.tryouts (
  title,
  slug,
  description,
  category,
  duration_minutes,
  passing_score,
  is_premium,
  is_active,
  total_questions
) VALUES
(
  'Tryout Matematika SMA - Kelas 10',
  'tryout-matematika-sma-kelas-10',
  'Latihan soal matematika untuk siswa SMA kelas 10 yang mencakup aljabar, geometri, dan trigonometri',
  'SMA',
  60,
  65,
  FALSE,
  TRUE,
  20
),
(
  'UTBK Saintek 2025 - Paket 1',
  'utbk-saintek-2025-paket-1',
  'Tryout simulasi UTBK Saintek lengkap dengan soal TPS, Matematika, Fisika, Kimia, dan Biologi',
  'UTBK',
  120,
  70,
  TRUE,
  TRUE,
  50
),
(
  'CPNS 2025 - TIU & TWK',
  'cpns-2025-tiu-twk',
  'Latihan soal CPNS mencakup Tes Intelegensi Umum dan Tes Wawasan Kebangsaan',
  'CPNS',
  90,
  65,
  TRUE,
  TRUE,
  100
),
(
  'Tryout IPA SD Kelas 6',
  'tryout-ipa-sd-kelas-6',
  'Latihan soal IPA untuk persiapan ujian akhir semester SD kelas 6',
  'SD',
  45,
  60,
  FALSE,
  TRUE,
  25
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample vouchers
INSERT INTO public.vouchers (
  code,
  discount_type,
  discount_value,
  max_usage,
  current_usage,
  valid_until,
  is_active
) VALUES
(
  'NEWYEAR2025',
  'percentage',
  20,
  100,
  0,
  NOW() + INTERVAL '30 days',
  TRUE
),
(
  'STUDENT50',
  'percentage',
  50,
  50,
  0,
  NOW() + INTERVAL '60 days',
  TRUE
),
(
  'WELCOME10K',
  'fixed',
  10000,
  NULL,
  0,
  NOW() + INTERVAL '90 days',
  TRUE
)
ON CONFLICT (code) DO NOTHING;
