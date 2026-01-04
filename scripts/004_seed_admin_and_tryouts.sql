-- Insert default admin account
-- Username: admin
-- Password: Admin123! (you should change this after first login)
INSERT INTO admins (id, username, email, full_name, password_hash, must_change_password)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'admin',
  'admin@tryoutpro.com',
  'Administrator',
  crypt('Admin123!', gen_salt('bf')),
  true
)
ON CONFLICT (username) DO NOTHING;

-- Insert sample premium tryout
INSERT INTO tryouts (
  id,
  title,
  slug,
  description,
  category,
  is_premium,
  duration_minutes,
  passing_score,
  is_active,
  total_questions,
  created_by
) VALUES (
  gen_random_uuid(),
  'UTBK SNBT 2024 - Paket Premium 1',
  'utbk-snbt-2024-premium-1',
  'Tryout UTBK SNBT 2024 dengan soal-soal berkualitas tinggi yang disesuaikan dengan kisi-kisi terbaru. Cocok untuk persiapan menghadapi ujian masuk PTN.',
  'UTBK',
  true,
  180,
  60,
  true,
  100,
  '00000000-0000-0000-0000-000000000001'::UUID
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample free tryout
INSERT INTO tryouts (
  id,
  title,
  slug,
  description,
  category,
  is_premium,
  duration_minutes,
  passing_score,
  is_active,
  total_questions,
  created_by
) VALUES (
  gen_random_uuid(),
  'UTBK SNBT 2024 - Paket Gratis 1',
  'utbk-snbt-2024-free-1',
  'Tryout gratis UTBK SNBT 2024 untuk mencoba platform TryoutPro. Dapatkan pengalaman mengerjakan soal-soal UTBK dengan sistem CAT.',
  'UTBK',
  false,
  90,
  50,
  true,
  50,
  '00000000-0000-0000-0000-000000000001'::UUID
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample questions for free tryout (5 sample questions)
-- Fixed difficulty values to match check constraint: 'easy', 'medium', 'hard'
DO $$
DECLARE
  tryout_id_var UUID;
BEGIN
  SELECT id INTO tryout_id_var FROM tryouts WHERE slug = 'utbk-snbt-2024-free-1' LIMIT 1;
  
  IF tryout_id_var IS NOT NULL THEN
    -- Question 1: Matematika
    INSERT INTO questions (
      id, tryout_id, question_number, question_text,
      option_a, option_b, option_c, option_d, option_e,
      correct_answer, explanation, topic, difficulty
    ) VALUES (
      gen_random_uuid(), tryout_id_var, 1,
      'Jika f(x) = 2x + 3 dan g(x) = x² - 1, maka (f ∘ g)(2) adalah...',
      '9', '11', '13', '15', '17',
      'B',
      'Langkah penyelesaian: (f ∘ g)(2) = f(g(2)). Hitung g(2) = 2² - 1 = 3. Kemudian f(3) = 2(3) + 3 = 9.',
      'Matematika - Fungsi Komposisi',
      'medium'
    ) ON CONFLICT DO NOTHING;
    
    -- Question 2: Bahasa Indonesia
    INSERT INTO questions (
      id, tryout_id, question_number, question_text,
      option_a, option_b, option_c, option_d, option_e,
      correct_answer, explanation, topic, difficulty
    ) VALUES (
      gen_random_uuid(), tryout_id_var, 2,
      'Kata yang memiliki makna konotasi dalam kalimat "Dia memiliki hati emas" adalah...',
      'Memiliki', 'Hati', 'Emas', 'Dia', 'Adalah',
      'C',
      'Kata "emas" dalam kalimat ini bermakna konotasi, yaitu memiliki sifat mulia atau baik hati, bukan bermakna denotatif logam mulia.',
      'Bahasa Indonesia - Makna Kata',
      'easy'
    ) ON CONFLICT DO NOTHING;
    
    -- Question 3: Bahasa Inggris
    INSERT INTO questions (
      id, tryout_id, question_number, question_text,
      option_a, option_b, option_c, option_d, option_e,
      correct_answer, explanation, topic, difficulty
    ) VALUES (
      gen_random_uuid(), tryout_id_var, 3,
      'She ____ to the library every Sunday.',
      'go', 'goes', 'going', 'gone', 'went',
      'B',
      'Subjek "She" adalah orang ketiga tunggal, sehingga verb harus ditambah -s/-es. "Goes" adalah bentuk yang benar.',
      'Bahasa Inggris - Simple Present Tense',
      'easy'
    ) ON CONFLICT DO NOTHING;
    
    -- Question 4: Fisika
    INSERT INTO questions (
      id, tryout_id, question_number, question_text,
      option_a, option_b, option_c, option_d, option_e,
      correct_answer, explanation, topic, difficulty
    ) VALUES (
      gen_random_uuid(), tryout_id_var, 4,
      'Sebuah benda bergerak dengan kecepatan awal 10 m/s dan mengalami percepatan 2 m/s². Kecepatan benda setelah 5 detik adalah...',
      '15 m/s', '20 m/s', '25 m/s', '30 m/s', '35 m/s',
      'B',
      'Menggunakan rumus v = v₀ + at = 10 + (2)(5) = 10 + 10 = 20 m/s',
      'Fisika - Gerak Lurus',
      'medium'
    ) ON CONFLICT DO NOTHING;
    
    -- Question 5: Kimia
    INSERT INTO questions (
      id, tryout_id, question_number, question_text,
      option_a, option_b, option_c, option_d, option_e,
      correct_answer, explanation, topic, difficulty
    ) VALUES (
      gen_random_uuid(), tryout_id_var, 5,
      'Unsur yang memiliki konfigurasi elektron 2, 8, 8, 1 termasuk golongan...',
      'IA', 'IIA', 'IIIA', 'IVA', 'VA',
      'A',
      'Elektron valensi (elektron terluar) = 1, sehingga termasuk golongan IA (alkali).',
      'Kimia - Sistem Periodik Unsur',
      'easy'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert sample voucher
INSERT INTO vouchers (
  id,
  code,
  discount_type,
  discount_value,
  max_usage,
  current_usage,
  valid_from,
  valid_until,
  is_active
) VALUES (
  gen_random_uuid(),
  'WELCOME2024',
  'percentage',
  20,
  100,
  0,
  NOW(),
  NOW() + INTERVAL '30 days',
  true
) ON CONFLICT (code) DO NOTHING;
