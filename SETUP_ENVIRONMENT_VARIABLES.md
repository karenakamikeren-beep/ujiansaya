# Panduan Lengkap: Cara Mendapatkan Environment Variables

## 📋 Daftar Environment Variables yang Dibutuhkan

### ✅ Sudah Ada (dari Supabase Integration)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Dan semua Supabase keys lainnya

### ⚠️ Yang Perlu Anda Setup Manual

1. **NEXT_PUBLIC_SITE_URL** - URL website Anda
2. **SMTP Settings** - Untuk kirim email
3. **MIDTRANS Keys** - Untuk payment gateway
4. **CRON_SECRET** - Untuk keamanan cron jobs
5. **NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL** - URL development

---

## 1. NEXT_PUBLIC_SITE_URL

### Apa itu?
URL website Anda yang bisa diakses publik.

### Cara Mendapatkan:

**Untuk Development (Local):**
\`\`\`
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

**Untuk Production (Setelah Deploy ke Vercel):**
1. Deploy project Anda ke Vercel (klik tombol "Publish" di v0)
2. Vercel akan memberikan URL otomatis, contoh: `https://tryoutpro.vercel.app`
3. Gunakan URL tersebut:
\`\`\`
NEXT_PUBLIC_SITE_URL=https://tryoutpro.vercel.app
\`\`\`

**Jika pakai custom domain:**
\`\`\`
NEXT_PUBLIC_SITE_URL=https://www.tryoutpro.com
\`\`\`

---

## 2. NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

### Apa itu?
URL redirect untuk email verification saat development.

### Cara Setting:

**Untuk Development:**
\`\`\`
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

**Catatan:** Variable ini hanya dipakai saat development lokal. Production akan pakai `window.location.origin` otomatis.

---

## 3. SMTP Settings (Email Configuration)

### Apa itu?
Konfigurasi untuk mengirim email otomatis (notifikasi, verifikasi, dll).

### Menggunakan Gmail (Paling Mudah untuk Pemula)

#### Langkah 1: Buat Gmail App Password

1. **Buka Google Account:**
   - Pergi ke https://myaccount.google.com/
   - Login dengan akun Gmail Anda

2. **Aktifkan 2-Step Verification:**
   - Klik "Security" di sidebar kiri
   - Scroll ke bawah, cari "2-Step Verification"
   - Klik dan ikuti petunjuk untuk mengaktifkannya
   - **WAJIB aktif dulu sebelum bisa buat App Password!**

3. **Generate App Password:**
   - Setelah 2-Step Verification aktif
   - Kembali ke halaman Security
   - Scroll ke "2-Step Verification" lagi
   - Di bagian bawah, cari "App passwords"
   - Klik "App passwords"
   - Pilih "Mail" untuk app type
   - Pilih "Other" untuk device, ketik "TryoutPro"
   - Klik "Generate"
   - **COPY password 16 karakter yang muncul** (contoh: `abcd efgh ijkl mnop`)

4. **Gunakan di Environment Variables:**
\`\`\`
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
\`\`\`

⚠️ **PENTING:**
- Ganti `youremail@gmail.com` dengan email Gmail Anda
- Ganti password dengan App Password yang Anda generate (16 karakter)
- JANGAN pakai password Gmail biasa Anda!
- Simpan App Password ini dengan aman

#### Troubleshooting Gmail:
- **Error "Less secure app"**: Pastikan pakai App Password, bukan password biasa
- **Error "2-Step Verification required"**: Aktifkan 2FA terlebih dahulu
- **Email tidak terkirim**: Cek apakah SMTP_PORT = 587 (bukan 465 atau 25)

---

## 4. MIDTRANS Keys (Payment Gateway)

### Apa itu?
Midtrans adalah payment gateway Indonesia untuk menerima pembayaran online.

### ⚠️ PENTING: Format Key Midtrans

Midtrans memiliki 2 environment yang berbeda dengan format key yang berbeda:

#### Sandbox (Testing) - WAJIB pakai prefix "SB-"
\`\`\`
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox
\`\`\`

#### Production (Real Payment) - TANPA prefix "SB-"
\`\`\`
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=production
\`\`\`

**Jika key Anda tidak memiliki prefix "SB-" tetapi environment adalah "sandbox", Anda HARUS menambahkan "SB-" di depannya!**

### Cara Mendapatkan (Step-by-Step):

#### Langkah 1: Daftar Akun Midtrans

1. **Buka Website Midtrans:**
   - Pergi ke https://dashboard.midtrans.com/register

2. **Isi Form Registrasi:**
   - Masukkan email bisnis Anda
   - Buat password yang kuat
   - Isi nama bisnis/toko Anda
   - Pilih jenis bisnis: "Education" atau "Online Services"
   - Isi nomor telepon

3. **Verifikasi Email:**
   - Cek inbox email Anda
   - Klik link verifikasi dari Midtrans

4. **Login ke Dashboard:**
   - Pergi ke https://dashboard.midtrans.com/login
   - Login dengan email dan password Anda

#### Langkah 2: Dapatkan Sandbox Keys (untuk Testing)

1. **Di Dashboard Midtrans:**
   - Setelah login, Anda akan lihat menu di sidebar kiri
   - Pastikan Anda di mode "Sandbox" (ada toggle di kanan atas)
   - Toggle biasanya berwarna **BIRU** untuk Sandbox

2. **Ambil Keys dari Dashboard:**
   - Klik menu "Settings" di sidebar
   - Klik "Access Keys"
   - Anda akan melihat 2 keys:
     - **Client Key**
     - **Server Key**

3. **Periksa Format Key:**
   
   **Jika key Anda SUDAH ada prefix "SB-"** (contoh: `SB-Mid-client-xxx`):
   - ✅ Copy langsung tanpa modifikasi
   
   **Jika key Anda TIDAK ada prefix "SB-"** (contoh: `Mid-client-xxx`):
   - ⚠️ Tambahkan "SB-" di depannya
   - Contoh: `Mid-client-O4BSv-VRsgEz-DUS` → `SB-Mid-client-O4BSv-VRsgEz-DUS`
   - Contoh: `Mid-server-ZHGRfqs8OPbgM6xiTb-5Kurg` → `SB-Mid-server-ZHGRfqs8OPbgM6xiTb-5Kurg`

4. **Set Environment Variables:**
\`\`\`
MIDTRANS_SERVER_KEY=SB-Mid-server-ZHGRfqs8OPbgM6xiTb-5Kurg
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-O4BSv-VRsgEz-DUS
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox
\`\`\`

#### Langkah 3: Setup Webhook (Penting!)

1. **Di Dashboard Midtrans:**
   - Masih di menu "Settings"
   - Klik "Configuration"
   - Scroll ke bagian "Payment Notification URL"

2. **Isi Webhook URL:**
   - Masukkan: `https://your-domain.vercel.app/api/payment/webhook`
   - Ganti `your-domain.vercel.app` dengan URL Vercel Anda
   - **Jangan lupa `/api/payment/webhook` di akhir!**

3. **Enable Notification:**
   - Centang "Enable Payment Notification"
   - Klik "Save Changes"

#### Langkah 4: Testing Payment (Sandbox Mode)

Untuk testing di Sandbox, gunakan kartu kredit dummy ini:
- **Card Number:** `4811 1111 1111 1114`
- **CVV:** `123`
- **Exp Date:** Bulan/tahun apa saja di masa depan (contoh: `12/25`)
- **OTP/3DS:** `112233`

**Bank Transfer Testing:**
- Bank: Pilih bank apa saja
- VA Number: Akan digenerate otomatis
- Buka Midtrans Simulator: https://simulator.sandbox.midtrans.com/
- Masukkan Order ID dan submit untuk simulasi pembayaran berhasil

#### Langkah 5: Go Live (Production)

Setelah testing sukses dan ingin menerima pembayaran real:

1. **Lengkapi Dokumen Bisnis:**
   - Di dashboard, akan ada notifikasi untuk melengkapi dokumen
   - Upload: KTP, NPWP, dokumen bisnis
   - Proses verifikasi 1-3 hari kerja

2. **Setelah Disetujui:**
   - Toggle ke mode "Production" di dashboard (toggle berubah HIJAU)
   - Ambil Production Keys (cara sama seperti Sandbox)
   - **Production keys TIDAK pakai prefix "SB-"**
   - Update environment variables:
\`\`\`
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=production
\`\`\`

#### ⚠️ Common Mistakes & Troubleshooting

**Error: "Access denied" atau "Invalid signature"**
- ✅ Solusi: Pastikan key Anda sesuai dengan environment
- Sandbox environment = key dengan prefix "SB-"
- Production environment = key TANPA prefix "SB-"

**Error: "Merchant not found"**
- ✅ Solusi: Periksa apakah Anda copy key dengan lengkap (tidak terpotong)

**Payment tidak masuk webhook**
- ✅ Solusi: Pastikan webhook URL sudah diset dengan benar di Midtrans dashboard

---

## 5. CRON_SECRET

### Apa itu?
String rahasia untuk melindungi cron jobs agar tidak bisa diakses sembarangan.

### Cara Membuat:

Anda bisa generate random string sendiri. Ada beberapa cara:

#### Option 1: Generate Online (Paling Mudah)
1. Buka https://randomkeygen.com/
2. Copy salah satu "CodeIgniter Encryption Keys"
3. Contoh: `d2f8a9b4c1e6g3h7i5j9k0l2m4n8o6p1q3r7s5t9u0v2w4x6y8z1a3b5c7d9e`

#### Option 2: Generate di Terminal (Jika punya Node.js)
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

#### Option 3: Buat Manual
Buat string acak minimal 32 karakter, campuran huruf, angka, dan simbol:
\`\`\`
mySecretCronKey2024!TryoutProPlatform@#$
\`\`\`

### Gunakan di Environment:
\`\`\`
CRON_SECRET=d2f8a9b4c1e6g3h7i5j9k0l2m4n8o6p1q3r7s5t9u0v2w4x6y8z1a3b5c7d9e
\`\`\`

⚠️ **PENTING:** Simpan string ini dengan aman. Anda akan butuh ini untuk setup cron jobs.

---

## 📝 Ringkasan: Semua Environment Variables

Copy-paste template ini dan isi dengan nilai Anda:

\`\`\`env
# ============================================
# SUPABASE (Sudah Ada dari Integration)
# ============================================
# Tidak perlu diisi, sudah otomatis dari v0

# ============================================
# SITE CONFIGURATION
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Production: https://tryoutpro.vercel.app

NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# ============================================
# EMAIL CONFIGURATION (Gmail)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
# Ganti dengan Gmail App Password Anda

# ============================================
# MIDTRANS PAYMENT (Sandbox for Testing)
# ============================================
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox
# Production: ganti ke "production" dan pakai keys tanpa "SB-"

# ============================================
# SECURITY
# ============================================
CRON_SECRET=d2f8a9b4c1e6g3h7i5j9k0l2m4n8o6p1q3r7s5t9u0v2w4x6y8z1a3b5c7d9e
# Generate random string 32+ karakter
\`\`\`

---

## 🚀 Cara Menambahkan ke Vercel

### Option 1: Via v0 UI (Paling Mudah)
1. Buka chat ini di v0
2. Klik icon "⚙️ Settings" di sidebar kiri
3. Klik tab "Vars"
4. Klik "Add Variable"
5. Masukkan KEY dan VALUE satu per satu
6. Klik "Save"

### Option 2: Via Vercel Dashboard
1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Klik tab "Settings"
4. Klik "Environment Variables" di sidebar
5. Tambahkan satu per satu:
   - Key: Nama variable (contoh: `SMTP_HOST`)
   - Value: Nilai variable (contoh: `smtp.gmail.com`)
   - Environment: Pilih "Production", "Preview", dan "Development"
6. Klik "Save"

### Option 3: Via Vercel CLI
\`\`\`bash
vercel env add SMTP_HOST
# Enter value: smtp.gmail.com
# Select environment: Production, Preview, Development
\`\`\`

---

## ✅ Checklist Setup

Centang setiap langkah yang sudah Anda selesaikan:

- [ ] Deploy project ke Vercel (dapatkan URL)
- [ ] Set `NEXT_PUBLIC_SITE_URL` dengan URL Vercel
- [ ] Aktifkan Gmail 2-Step Verification
- [ ] Generate Gmail App Password
- [ ] Set semua SMTP variables
- [ ] Daftar akun Midtrans
- [ ] Ambil Midtrans Sandbox Keys
- [ ] Set Midtrans webhook URL
- [ ] Generate dan set CRON_SECRET
- [ ] Test kirim email (coba register user baru)
- [ ] Test payment dengan kartu dummy Midtrans

---

## 🆘 Bantuan & Troubleshooting

### Email Tidak Terkirim?
1. Pastikan 2FA Gmail sudah aktif
2. Pastikan pakai App Password, bukan password biasa
3. Cek SMTP_PORT = 587
4. Cek tidak ada spasi di SMTP_PASSWORD

### Payment Midtrans Error?
1. Pastikan webhook URL sudah diset
2. Pastikan environment = "sandbox" untuk testing
3. Gunakan kartu dummy untuk testing
4. Cek di Midtrans dashboard > Transactions untuk log error

### Supabase Auth Error?
1. Pastikan sudah jalankan semua SQL scripts
2. Cek RLS policies sudah aktif di Supabase dashboard
3. Pastikan email confirmation di-enable di Supabase > Auth settings

### Need More Help?
- **Midtrans Docs:** https://docs.midtrans.com/
- **Gmail SMTP:** https://support.google.com/mail/answer/185833
- **Supabase Docs:** https://supabase.com/docs

---

## 📚 Next Steps

Setelah semua environment variables sudah diset:

1. **Jalankan Database Scripts** (11 files di folder `/scripts`)
2. **Test Authentication** (register, login, logout)
3. **Test Email** (cek inbox setelah register)
4. **Test Payment** (beli premium dengan kartu dummy)
5. **Test Tryout** (ikuti tryout, lihat hasil)

Selamat! Platform TryoutPro Anda siap digunakan 🎉
