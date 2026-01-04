# Checklist Eksekusi Manual - TryoutPro

Semua kode sudah selesai dibuat. Berikut adalah checklist langkah-langkah yang **WAJIB Anda lakukan secara manual**:

---

## 1. Setup Environment Variables di Vercel/v0

### Cara di v0:
1. Klik ikon **"Vars"** di sidebar kiri chat
2. Tambahkan satu per satu variabel berikut:

### Variables yang WAJIB ditambahkan:

#### A. Midtrans (Payment Gateway)
\`\`\`
MIDTRANS_SERVER_KEY=SB-Mid-server-XXXXXXXXXXXX
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXXXXXXXXXXX
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox
\`\`\`
**Cara dapat:**
- Daftar di https://dashboard.midtrans.com
- Pilih "Sandbox" environment
- Copy Server Key dan Client Key

#### B. Gmail SMTP (Email Notifications)
\`\`\`
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
\`\`\`
**Cara dapat Gmail App Password:**
- Tutorial lengkap ada di `SETUP_ENVIRONMENT_VARIABLES.md`
- Ringkas: Google Account → Security → 2FA → App Passwords

#### C. Site Configuration
\`\`\`
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
\`\`\`
**Cara dapat:**
- `NEXT_PUBLIC_SITE_URL`: Akan otomatis dapat setelah deploy ke Vercel
- Untuk development local: gunakan `http://localhost:3000`

#### D. CRON Secret (Opsional)
\`\`\`
CRON_SECRET=random-32-character-string-here
\`\`\`
**Cara generate:**
- Buka https://randomkeygen.com/
- Copy salah satu Fort Knox Password (32+ karakter)

**Status Checklist:**
- [ ] Semua environment variables sudah ditambahkan di v0 Vars section
- [ ] Sudah dapat Midtrans keys (Server + Client Key)
- [ ] Sudah dapat Gmail App Password (16 karakter)
- [ ] NEXT_PUBLIC_SITE_URL sudah diset (setelah deploy)

---

## 2. Jalankan Database Scripts di Supabase

### Cara eksekusi:
Ada 2 cara:

#### Cara 1: Langsung dari v0 (RECOMMENDED)
v0 bisa menjalankan SQL scripts otomatis! Anda tidak perlu copy-paste manual.
- Semua script sudah ada di folder `/scripts`
- v0 akan execute secara otomatis saat deploy

#### Cara 2: Manual di Supabase Dashboard
Jika cara 1 gagal, buka Supabase:
1. Buka Supabase Dashboard → SQL Editor
2. Buka setiap file di folder `/scripts` (urut 001-011)
3. Copy-paste isi file ke SQL Editor
4. Klik "Run"

### Scripts yang perlu dijalankan (URUT):
1. ✅ `001_create_extensions_and_users.sql`
2. ✅ `002_create_user_subscriptions_and_devices.sql`
3. ⚠️ `003_create_admins.sql` **(PERLU EDIT DULU!)**
4. ✅ `004_create_tryouts_and_questions.sql`
5. ✅ `005_create_attempts_and_answers.sql`
6. ✅ `006_create_payments_and_certificates.sql`
7. ✅ `007_create_referrals_and_vouchers.sql`
8. ✅ `008_create_audit_and_email_queue.sql`
9. ✅ `009_create_analytics_views.sql`
10. ✅ `010_create_profile_trigger.sql`
11. ✅ `011_seed_sample_data.sql`

### PENTING: Edit Script 003 (Admin Password)

**File:** `scripts/003_create_admins.sql`

**Yang perlu diganti:**
\`\`\`sql
-- CARI BARIS INI:
INSERT INTO admins (username, password_hash, full_name)
VALUES ('ADMIN', '$2a$10$PLACEHOLDER_HASH_HERE', 'Super Admin');

-- GANTI dengan hash bcrypt yang valid
\`\`\`

**Cara generate bcrypt hash:**

**Option 1 - Online Tool (PALING MUDAH):**
1. Buka https://bcrypt-generator.com/
2. Ketik password yang Anda inginkan (contoh: "ADMIN123")
3. Rounds: 10
4. Klik "Encrypt"
5. Copy hasil hash (contoh: `$2a$10$N9qo8uLOickgx2ZMRZoMye...`)
6. Ganti di SQL script

**Option 2 - Node.js:**
\`\`\`bash
node -e "console.log(require('bcryptjs').hashSync('ADMIN123', 10))"
\`\`\`

**Status Checklist:**
- [ ] Script 003 sudah diedit dengan bcrypt hash yang valid
- [ ] Semua 11 scripts berhasil dijalankan di Supabase
- [ ] Tidak ada error saat execute scripts
- [ ] Tabel-tabel sudah muncul di Supabase Table Editor

---

## 3. Setup Supabase Authentication

### Langkah-langkah:

1. **Buka Supabase Dashboard** → Authentication → URL Configuration
   - Site URL: `https://your-project.vercel.app`
   - Redirect URLs: Tambahkan:
     - `http://localhost:3000/**`
     - `https://your-project.vercel.app/**`

2. **Email Provider** (Authentication → Providers)
   - [x] Enable Email provider
   - [x] Confirm email: ON
   - Email Templates → Customize jika perlu

3. **Google OAuth** (OPSIONAL)
   - Enable Google Provider
   - Dapatkan OAuth credentials dari Google Cloud Console
   - Redirect URL: `https://your-supabase-project.supabase.co/auth/v1/callback`

**Status Checklist:**
- [ ] Site URL sudah diset di Supabase
- [ ] Redirect URLs sudah ditambahkan
- [ ] Email provider aktif
- [ ] Email confirmation aktif
- [ ] (Opsional) Google OAuth aktif

---

## 4. Setup Midtrans Webhook

### Langkah-langkah:

1. **Login ke Midtrans Dashboard**
   - https://dashboard.midtrans.com

2. **Settings → Configuration**
   - Pilih environment (Sandbox atau Production)

3. **Payment Notification URL**
   - Tambahkan: `https://your-project.vercel.app/api/payment/webhook`
   - Save

4. **HTTP Method**
   - POST (sudah default)

**Status Checklist:**
- [ ] Webhook URL sudah ditambahkan di Midtrans
- [ ] Environment sesuai (Sandbox untuk testing)
- [ ] Webhook tested (bisa test manual nanti setelah deploy)

---

## 5. Deploy ke Vercel

### Langkah-langkah:

1. **Dari v0 Interface:**
   - Klik tombol **"Publish"** di kanan atas
   - Vercel akan otomatis deploy project Anda
   - Tunggu sampai selesai

2. **Set Environment Variables di Vercel:**
   - Vercel Project → Settings → Environment Variables
   - Tambahkan semua variables dari Langkah 1

3. **Redeploy jika perlu:**
   - Jika tambah env vars setelah deploy, redeploy:
   - Deployments → ... → Redeploy

**Status Checklist:**
- [ ] Project berhasil di-deploy ke Vercel
- [ ] Environment variables sudah ditambahkan di Vercel
- [ ] Site URL production sudah didapat
- [ ] Bisa akses homepage di URL production

---

## 6. Testing Lengkap

### A. Test Authentication
- [ ] Buka `/auth/register` - Daftar akun baru
- [ ] Cek email - Verifikasi email berhasil
- [ ] Login dengan akun yang baru dibuat
- [ ] Onboarding flow berjalan dan selesai
- [ ] Logout dan login lagi

### B. Test Tryout System
- [ ] Browse catalog `/catalog` - Tryout tampil
- [ ] Filter by category (SD, SMP, SMA, dll)
- [ ] Klik tryout → Detail page tampil
- [ ] Start tryout → Exam interface muncul
- [ ] Timer countdown berjalan
- [ ] Jawab beberapa soal → Auto-save bekerja
- [ ] Submit tryout → Redirect ke results page
- [ ] Results page menampilkan score dan rank

### C. Test Payment (Sandbox)
- [ ] Buka `/pricing` - Pricing plans tampil
- [ ] Klik "Subscribe Now" → Checkout page
- [ ] Isi form dan klik Pay → Midtrans Snap muncul
- [ ] Gunakan test card Midtrans:
  \`\`\`
  Card Number: 4811 1111 1111 1114
  Exp Date: 01/25
  CVV: 123
  \`\`\`
- [ ] Payment berhasil → Premium activated
- [ ] Cek dashboard → Badge "Premium" muncul

### D. Test Referral
- [ ] Buka `/referral` - Kode referral Anda tampil
- [ ] Copy kode referral
- [ ] Logout → Register akun baru dengan kode referral
- [ ] Akun baru selesaikan 1 tryout
- [ ] Akun Anda (referrer) dapat reward 7 hari premium

### E. Test Admin Panel
- [ ] Buka `/admin/login`
- [ ] Login dengan username: `ADMIN` dan password yang Anda set
- [ ] Dashboard analytics tampil
- [ ] Buka `/admin/tryouts` - CRUD tryouts
- [ ] Buka `/admin/users` - User list tampil

### F. Test Email (Jika SMTP sudah setup)
- [ ] Complete tryout → Cek email notification
- [ ] Referral success → Cek email notification
- [ ] Premium activated → Cek email notification

**Status Checklist:**
- [ ] Semua test authentication passed
- [ ] Tryout system bekerja 100%
- [ ] Payment sandbox berhasil
- [ ] Referral rewards bekerja
- [ ] Admin panel accessible
- [ ] Email notifications terkirim (opsional)

---

## 7. Post-Deployment Configuration

### A. Update Midtrans Webhook
Sekarang Anda sudah punya production URL, update webhook:
- [ ] Midtrans Dashboard → Settings
- [ ] Ganti webhook URL ke production: `https://your-domain.vercel.app/api/payment/webhook`

### B. Update Supabase Redirect URLs
- [ ] Supabase → Authentication → URL Configuration
- [ ] Tambahkan production URL di redirect URLs

### C. Update Environment Variables
- [ ] Update `NEXT_PUBLIC_SITE_URL` dengan production URL
- [ ] Redeploy Vercel

**Status Checklist:**
- [ ] Webhook production URL updated
- [ ] Supabase URLs updated
- [ ] All production URLs configured

---

## 8. Security Checklist (PENTING!)

### Immediately After First Deploy:
- [ ] **Ganti admin password** dari default `ADMIN123`
  - Login admin → Update di database atau buat fitur change password

- [ ] **Review RLS Policies** di Supabase
  - Pastikan semua tabel penting sudah punya RLS aktif
  - Test dengan user biasa (jangan bisa akses data user lain)

- [ ] **Secure API Routes**
  - Cek semua API routes punya authentication check
  - Test unauthorized access (harus return 401)

- [ ] **Hide Sensitive Data**
  - Pastikan tidak ada API key/secret ter-expose di client
  - Check browser DevTools → Network → Response bodies

**Status Checklist:**
- [ ] Admin password diganti
- [ ] RLS policies verified
- [ ] API routes secured
- [ ] No sensitive data in client

---

## 9. Optional Enhancements

### A. Google AdSense (untuk Monetisasi)
- [ ] Daftar Google AdSense account
- [ ] Verifikasi website ownership
- [ ] Dapatkan ad unit code
- [ ] Tambahkan di pages untuk free users

### B. Vercel Cron Jobs (untuk Email Queue)
Tambahkan file `vercel.json`:
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
- [ ] File `vercel.json` dibuat
- [ ] Cron job berjalan setiap 5 menit
- [ ] Email queue di-process otomatis

### C. Analytics & Monitoring
- [ ] Setup Vercel Analytics (gratis)
- [ ] Setup Sentry untuk error tracking (opsional)
- [ ] Monitor Supabase dashboard untuk slow queries

**Status Checklist:**
- [ ] (Opsional) AdSense integrated
- [ ] (Opsional) Cron jobs setup
- [ ] (Opsional) Monitoring tools added

---

## 10. Final Verification

### Sebelum Launch ke Public:
- [ ] All 11 database scripts executed successfully
- [ ] All environment variables configured
- [ ] All tests passed (auth, tryout, payment, referral)
- [ ] Admin panel accessible and functional
- [ ] Email notifications working (or queued)
- [ ] Payment webhook receiving notifications
- [ ] Security measures in place
- [ ] No console errors in production
- [ ] Mobile responsive (test di HP)
- [ ] Performance acceptable (load time < 3s)

### Ready to Launch:
- [ ] Announcement to users
- [ ] Customer support channel ready
- [ ] Backup strategy for database
- [ ] Monitoring alerts configured

---

## Troubleshooting Quick Guide

### Problem: Email tidak terkirim
**Solution:**
- Cek SMTP credentials di Vercel env vars
- Test manual: `/api/email/send` dengan Postman
- Cek Gmail "Less secure apps" (harusnya tidak perlu dengan App Password)

### Problem: Payment webhook tidak dipanggil
**Solution:**
- Cek Midtrans webhook URL sudah benar
- Test manual dengan Midtrans simulator
- Cek Vercel logs untuk incoming requests

### Problem: Database RLS blocking queries
**Solution:**
- Review RLS policies di script 001-010
- Temporary disable untuk debug:
  \`\`\`sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  \`\`\`
- Enable kembali setelah debug

### Problem: Build error di Vercel
**Solution:**
- Cek error message di Vercel logs
- Pastikan semua dependencies di `package.json`
- Cek TypeScript errors: `npm run build` locally

---

## Summary: Minimum Steps untuk Production

Jika Anda hanya ingin cepat launch (MVP), fokus di:

1. ✅ **Environment Variables** (Midtrans + Email + Site URL)
2. ✅ **Database Scripts** (Jalankan semua 11 scripts)
3. ✅ **Admin Password** (Edit script 003)
4. ✅ **Deploy ke Vercel** (Publish button)
5. ✅ **Test Payment** (Sandbox mode)
6. ✅ **Test Tryout Flow** (End-to-end)

Sisanya bisa di-configure belakangan.

---

## Need Help?

Jika ada step yang tidak jelas atau error:
1. Cek `DEPLOYMENT_GUIDE.md` untuk detail lengkap
2. Cek `SETUP_ENVIRONMENT_VARIABLES.md` untuk cara dapat keys
3. Review Supabase logs untuk database errors
4. Review Vercel logs untuk runtime errors

**Build Date:** 2025-01-04  
**All Features:** ✅ Complete  
**Status:** Ready for Manual Execution
