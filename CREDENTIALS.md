# Login Credentials untuk Testing

## Admin Panel
Akses admin panel di: `/admin`

**Admin Account:**
- Email: `admin@tryoutpro.com`
- Username: `admin`
- Password: `Admin123!`

## User Accounts (Dummy)

### User 1 - Premium User
- Email: `user1@gmail.com`
- Password: `user1`
- Status: Premium (berlangganan tahunan)
- Level: SMA
- Kode Referral: `PREMIUM01`

### User 2 - Free User
- Email: `user2@gmail.com`
- Password: `user2`
- Status: Free (belum premium)
- Level: SMP
- Kode Referral: `FREE02`

## Cara Login

### Login sebagai Admin:
1. Buka `/admin`
2. Masukkan username: `admin` dan password: `Admin123!`
3. Anda akan masuk ke admin dashboard

### Login sebagai User:
**PENTING**: User harus mendaftar terlebih dahulu melalui Supabase Auth karena sistem menggunakan Supabase Authentication.

#### Cara Membuat User Account:
1. Buka halaman `/auth/register`
2. Daftar dengan email:
   - `user1@gmail.com` dengan password: `user1`
   - `user2@gmail.com` dengan password: `user2`
3. Konfirmasi email (jika email confirmation diaktifkan)
4. Setelah itu, data user di database akan otomatis tersinkronisasi

**ATAU** jika Supabase email confirmation dinonaktifkan:
1. Buka Supabase Dashboard > Authentication > Users
2. Klik "Add User" dan buat user manual dengan email dan password di atas
3. Set email confirmed = true

## Fitur Admin Panel

### Upload Soal Tryout
Ya, fitur upload soal sudah tersedia! Admin dapat:

1. **Manage Tryouts** (`/admin/tryouts`)
   - Melihat semua tryout
   - Create tryout baru
   - Edit tryout existing
   - Delete tryout

2. **Create Tryout** (`/admin/tryouts/create`)
   - Input detail tryout (judul, deskripsi, kategori)
   - Set durasi dan passing score
   - Set premium/gratis
   - Upload thumbnail

3. **Manage Questions** (setelah create tryout)
   - Tambah soal satu per satu
   - Upload soal dalam bentuk bulk (CSV/JSON)
   - Edit soal existing
   - Tambah gambar untuk soal
   - Tambah penjelasan jawaban

### Fitur Admin Lainnya:
- Dashboard dengan analytics
- Manage users dan subscriptions
- View payment transactions
- Manage vouchers
- View audit logs
- Analytics & reports

## Notes untuk Production

1. **Ubah password admin** setelah setup pertama
2. **Aktifkan email confirmation** di Supabase untuk keamanan
3. **Setup SMTP** untuk email notifications
4. **Configure Midtrans** untuk payment gateway
5. **Setup domain** dan SSL certificate

## Voucher Code yang Tersedia

- Code: `WELCOME2024`
- Diskon: 20%
- Berlaku untuk 100 penggunaan pertama
- Valid: 30 hari dari sekarang
