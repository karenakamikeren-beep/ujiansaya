# TryoutPro - Panduan Deployment & Setup Manual

Platform tryout online premium dengan CAT system, payment integration (Midtrans), dan referral program.

## Tech Stack

- **Framework**: Next.js 16 (App Router) dengan React 19.2
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Payment**: Midtrans Snap
- **Email**: Nodemailer dengan Gmail SMTP
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **TypeScript**: Strict mode enabled

---

## Langkah 1: Setup Environment Variables

Tambahkan environment variables berikut ke project Vercel Anda atau file `.env.local`:

### Supabase (Sudah Terhubung)
\`\`\`env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Midtrans Payment (WAJIB)
\`\`\`env
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox # atau 'production'
\`\`\`

**Cara mendapatkan:**
1. Daftar di https://dashboard.midtrans.com
2. Pilih environment (Sandbox untuk testing)
3. Ambil Server Key dan Client Key dari dashboard
4. Untuk production, ganti ke environment production

### Email SMTP (WAJIB)
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
\`\`\`

**Cara mendapatkan Gmail App Password:**
1. Buka https://myaccount.google.com/security
2. Aktifkan 2-Step Verification
3. Buka https://myaccount.google.com/apppasswords
4. Generate password untuk "Mail"
5. Gunakan 16 karakter password tersebut

### Site Configuration (WAJIB)
\`\`\`env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
\`\`\`

### Cron Secret (Opsional - untuk email queue)
\`\`\`env
CRON_SECRET=your_random_secret_string
\`\`\`

---

## Langkah 2: Setup Database

Jalankan SQL scripts berikut di Supabase SQL Editor **secara berurutan**:

### Eksekusi dari v0 Console
Semua script sudah tersedia di folder `/scripts`. Jalankan dari console v0:

1. `001_create_extensions_and_users.sql` - Extensions & users table
2. `002_create_user_subscriptions_and_devices.sql` - Subscriptions & device tracking
3. `003_create_admins.sql` - Admin accounts
4. `004_create_tryouts_and_questions.sql` - Tryouts & questions
5. `005_create_attempts_and_answers.sql` - User attempts & answers
6. `006_create_payments_and_certificates.sql` - Payments & certificates
7. `007_create_referrals_and_vouchers.sql` - Referral system
8. `008_create_audit_and_email_queue.sql` - Audit logs & email queue
9. `009_create_analytics_views.sql` - Analytics views
10. `010_create_profile_trigger.sql` - Auto-create profile trigger
11. `011_seed_sample_data.sql` - Sample tryouts & questions

### PENTING: Update Admin Password

Di script `003_create_admins.sql`, ganti placeholder password hash dengan hash bcrypt yang valid:

**Generate bcrypt hash:**
\`\`\`bash
# Menggunakan Node.js
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('ADMIN123', 10));"
\`\`\`

Atau gunakan online tool: https://bcrypt-generator.com/

Ganti di SQL:
\`\`\`sql
INSERT INTO admins (username, password_hash, full_name)
VALUES ('ADMIN', '$2a$10$HASH_RESULT_HERE', 'Super Admin');
\`\`\`

---

## Langkah 3: Setup Supabase Authentication

1. **Buka Supabase Dashboard** → Authentication → Providers

2. **Email Provider** (Sudah aktif by default)
   - Pastikan "Enable Email provider" dicentang
   - Aktifkan "Confirm email" untuk verifikasi email

3. **Google OAuth** (Opsional)
   - Enable Google Provider
   - Tambahkan Google OAuth credentials dari Google Cloud Console
   - Tambahkan redirect URL: `https://your-project.supabase.co/auth/v1/callback`

4. **Email Templates** (Opsional - customize)
   - Authentication → Email Templates
   - Customize template untuk Confirm Signup, Reset Password, dll

---

## Langkah 4: Setup Midtrans Webhook

Untuk menerima notifikasi payment status:

1. Login ke Midtrans Dashboard
2. Settings → Configuration → Payment Notification URL
3. Tambahkan URL: `https://your-domain.vercel.app/api/payment/webhook`
4. Centang semua event types yang ingin diterima

---

## Langkah 5: Setup Vercel Cron Jobs (Opsional)

Untuk automated email queue processing, tambahkan di `vercel.json`:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/email/process-queue",
      "schedule": "*/5 * * * *"
    }
  ]
}
\`\`\`

Atau manual trigger via:
\`\`\`bash
curl -X POST https://your-domain.vercel.app/api/email/process-queue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
\`\`\`

---

## Langkah 6: Seed Sample Data (Opsional)

Untuk testing, jalankan script `011_seed_sample_data.sql` yang sudah menyediakan:
- 5 tryout contoh (berbagai kategori)
- 50+ soal untuk setiap tryout
- Admin account

Atau tambahkan data manual via admin panel setelah login.

---

## Struktur User Roles & Permissions

### 1. Free User
- Akses tryout gratis (tanpa pembahasan)
- Lihat ranking di leaderboard
- Batasan 2 perangkat
- Melihat iklan (placeholder untuk Google AdSense)

### 2. Premium User
- Akses semua tryout (gratis + premium)
- Pembahasan lengkap setiap soal
- Download sertifikat
- Tanpa iklan
- Analisis weak topics mendalam

### 3. Content Creator
- Semua fitur premium
- Upload soal tryout sendiri
- Earning dari tryout yang dibeli user

### 4. Admin
- Full access ke admin panel
- CRUD tryouts, questions, users
- Analytics dashboard
- User management
- Payment tracking

---

## Testing Checklist

### Authentication
- [ ] Register dengan email/password
- [ ] Email verification berhasil
- [ ] Login berhasil
- [ ] Onboarding flow berjalan
- [ ] Google OAuth (jika diaktifkan)

### Tryout System
- [ ] Browse catalog dengan filtering
- [ ] Start tryout
- [ ] Timer berjalan
- [ ] Auto-save jawaban
- [ ] Submit & lihat hasil
- [ ] Rank ditampilkan

### Payment
- [ ] Pricing page tampil
- [ ] Checkout flow berhasil
- [ ] Midtrans Snap muncul
- [ ] Payment sandbox berhasil
- [ ] Premium activated setelah payment

### Referral
- [ ] Kode referral auto-generate
- [ ] Register dengan kode referral
- [ ] Reward premium 7 hari setelah tryout pertama
- [ ] Email notifikasi terkirim

### Admin Panel
- [ ] Login admin berhasil
- [ ] Dashboard analytics tampil
- [ ] CRUD tryouts berfungsi
- [ ] User management berfungsi

---

## Known Issues & Solutions

### Issue 1: Email tidak terkirim
**Solusi:**
- Pastikan Gmail App Password benar
- Cek "Less secure app access" di Google Account (seharusnya tidak perlu jika pakai App Password)
- Periksa SMTP port (587 untuk TLS, 465 untuk SSL)

### Issue 2: Midtrans Snap tidak muncul
**Solusi:**
- Pastikan Client Key di environment variables benar
- Cek browser console untuk error
- Pastikan domain di Midtrans dashboard sudah ditambahkan

### Issue 3: Referral reward tidak masuk
**Solusi:**
- Pastikan referred user menyelesaikan minimal 1 tryout
- Cek tabel `referrals` status `reward_status`
- Trigger manual via admin panel jika perlu

### Issue 4: Row Level Security blocking queries
**Solusi:**
- Pastikan RLS policies sudah dijalankan (script 001-011)
- Untuk debug, temporary disable RLS:
\`\`\`sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
\`\`\`

---

## Admin Access

**Default Admin Login:**
- URL: `/admin/login`
- Username: `ADMIN`
- Password: `ADMIN123` (atau sesuai yang Anda set di bcrypt hash)

**Segera ganti password** setelah first login!

---

## Deployment ke Vercel

1. **Push ke GitHub**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
\`\`\`

2. **Connect di Vercel**
- Import project dari GitHub
- Add environment variables (semua dari Langkah 1)
- Deploy!

3. **Post-Deployment**
- Jalankan database migrations (scripts 001-011)
- Test authentication flow
- Setup Midtrans webhook
- Seed sample data (opsional)

---

## Monitoring & Maintenance

### Database Monitoring
- Supabase Dashboard → Database → Table Editor
- Monitor `email_queue` untuk pending emails
- Check `audit_logs` untuk admin actions

### Payment Monitoring
- Midtrans Dashboard untuk transaction status
- Check `payments` table di database
- Monitor webhook logs di Vercel

### Email Queue
- Jalankan cron job atau manual trigger
- Monitor `email_queue` table status
- Check failed emails (`attempts >= 3`)

---

## Next Steps / Improvements

1. **Google AdSense Integration**
   - Sign up untuk AdSense account
   - Tambahkan ad units di free user pages
   - Monitor ad performance

2. **Advanced Analytics**
   - Implement chart visualizations dengan Recharts
   - Add more views (user retention, conversion rate, dll)
   - Export reports to CSV/PDF

3. **Content Creator Features**
   - Upload UI untuk creators
   - Revenue sharing dashboard
   - Approval workflow untuk tryout baru

4. **Mobile App**
   - React Native atau Flutter version
   - Push notifications untuk tryout reminders
   - Offline mode untuk premium users

5. **Gamification**
   - Badges & achievements
   - Streak tracking
   - Leaderboard seasons

---

## Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Midtrans Docs**: https://docs.midtrans.com
- **Tailwind CSS**: https://tailwindcss.com/docs

Untuk bug reports atau feature requests, gunakan GitHub Issues di repository project.

---

**Build Date**: 2025-01-04  
**Version**: 1.0.0  
**Status**: Production Ready ✓
