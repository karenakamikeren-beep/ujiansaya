-- ============================================
-- SEED SAMPLE TRYOUTS
-- ============================================

-- Get admin ID
DO $$
DECLARE
  admin_uuid UUID;
BEGIN
  SELECT id INTO admin_uuid FROM public.admins WHERE username = 'ADMIN' LIMIT 1;

  -- Insert sample tryouts
  INSERT INTO public.tryouts (title, description, category, duration_minutes, passing_score, is_premium, is_active, created_by) VALUES
  ('Tryout UTBK TPS 2025 - Paket 1', 'Tryout lengkap untuk persiapan UTBK TPS meliputi Penalaran Umum, Pengetahuan Kuantitatif, Pengetahuan dan Pemahaman Umum, serta Bahasa Indonesia dan Bahasa Inggris', 'UTBK', 120, 60, TRUE, TRUE, admin_uuid),
  ('Tryout Matematika SMA Kelas 12', 'Latihan soal matematika untuk persiapan ujian akhir semester dan UTBK', 'SMA', 90, 70, FALSE, TRUE, admin_uuid),
  ('Tryout CPNS TIU 2025', 'Tes Intelegensi Umum untuk persiapan seleksi CPNS', 'CPNS', 90, 75, TRUE, TRUE, admin_uuid),
  ('Tryout Kedinasan STAN 2025', 'Tryout khusus persiapan masuk STAN (TPA dan TBI)', 'KEDINASAN', 100, 65, TRUE, TRUE, admin_uuid),
  ('Tryout IPA SMP Kelas 9', 'Latihan soal IPA untuk persiapan ujian sekolah', 'SMP', 60, 65, FALSE, TRUE, admin_uuid);

  -- Sample questions for first tryout (UTBK)
  INSERT INTO public.questions (tryout_id, question_number, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty, topic)
  SELECT 
    t.id,
    1,
    'Jika x + y = 10 dan x - y = 4, maka nilai xy adalah...',
    '12',
    '21',
    '24',
    '28',
    '32',
    'B',
    'Dari x + y = 10 dan x - y = 4, didapat x = 7 dan y = 3. Maka xy = 7 × 3 = 21',
    'medium',
    'Aljabar'
  FROM public.tryouts t WHERE t.title = 'Tryout UTBK TPS 2025 - Paket 1' LIMIT 1;

  INSERT INTO public.questions (tryout_id, question_number, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty, topic)
  SELECT 
    t.id,
    2,
    'Antonim dari kata "OPTIMIS" adalah...',
    'Pesimis',
    'Realistis',
    'Apatis',
    'Ambigu',
    'Pragmatis',
    'A',
    'Optimis berarti berpikiran positif/penuh harapan. Antonimnya adalah Pesimis yang berarti berpikiran negatif/tidak memiliki harapan',
    'easy',
    'Bahasa Indonesia'
  FROM public.tryouts t WHERE t.title = 'Tryout UTBK TPS 2025 - Paket 1' LIMIT 1;

  INSERT INTO public.questions (tryout_id, question_number, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty, topic)
  SELECT 
    t.id,
    3,
    'Dalam sebuah kelas terdapat 40 siswa. Jika 60% siswa lulus ujian matematika dan 75% siswa lulus ujian bahasa Indonesia, berapa minimum siswa yang lulus kedua ujian?',
    '10 siswa',
    '14 siswa',
    '16 siswa',
    '20 siswa',
    '24 siswa',
    'B',
    'Gunakan prinsip inclusion-exclusion. Minimum yang lulus keduanya = (60% + 75% - 100%) × 40 = 35% × 40 = 14 siswa',
    'hard',
    'Logika'
  FROM public.tryouts t WHERE t.title = 'Tryout UTBK TPS 2025 - Paket 1' LIMIT 1;

  -- Update total_questions for tryouts
  UPDATE public.tryouts t
  SET total_questions = (
    SELECT COUNT(*) FROM public.questions q WHERE q.tryout_id = t.id
  );

END $$;
