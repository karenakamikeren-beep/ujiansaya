# Setup Instructions

## Database Setup

Scripts yang perlu dijalankan secara berurutan:

### 1. ✅ Script 001 & 002 (sudah jalan)
Database schema dan RLS policies sudah aktif.

### 2. Script 004 - Seed Admin & Tryouts
```bash
# Jalankan di Supabase SQL Editor
scripts/004_seed_admin_and_tryouts.sql
```
Membuat:
- Admin account
- 2 sample tryouts (1 premium UTBK, 1 gratis CPNS)
- 10 sample questions

### 3. Script 006 - Payments & Certificates
```bash
# Jalankan di Supabase SQL Editor  
scripts/006_create_payments_and_certificates.sql
```
✅ Already executed successfully!

### 4. ❌ Script 005 - SKIP (tidak bisa dijalankan)
User accounts TIDAK bisa dibuat langsung di database karena foreign key ke `auth.users` (Supabase Auth).

## Login Credentials

### Admin Panel (`/admin`)
- **Username**: `admin`
- **Password**: `Admin123!`

### Test Users (harus register di `/auth/register` terlebih dahulu)

**User Premium:**
- Email: `user1@gmail.com`
- Password: `user1`
- Setelah register, jalankan SQL ini untuk beri akses premium:
```sql
UPDATE user_subscriptions 
SET status = 'active', 
    start_date = CURRENT_TIMESTAMP,
    end_date = CURRENT_TIMESTAMP + INTERVAL '1 year'
WHERE user_id = (SELECT id FROM users WHERE email = 'user1@gmail.com');
```

**User Free:**
- Email: `user2@gmail.com`  
- Password: `user2`
- Akses gratis (tidak perlu query tambahan)

## Upload Soal

Setelah login sebagai admin, Anda bisa:

1. **Buat Tryout Baru**: `/admin/tryouts/create`
2. **Upload Soal**: 
   - Manual input per soal
   - Bulk import (jika ada)
3. **Manage Tryouts**: `/admin/tryouts`

## Next Steps

1. ✅ Jalankan script 004
2. ✅ Login admin di `/admin`
3. ✅ Register user1 dan user2 di `/auth/register`
4. ✅ Grant premium ke user1 (SQL query di atas)
5. ✅ Mulai upload soal Anda!
