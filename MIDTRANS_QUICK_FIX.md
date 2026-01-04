# Quick Fix: Midtrans Keys Format

## Masalah yang Anda Alami

Key yang Anda dapat dari Midtrans:
- Client Key: `Mid-client-O4BSv-VRsgEz-DUS`
- Server Key: `Mid-server-ZHGRfqs8OPbgM6xiTb-5Kurg`
- Environment: `sandbox`

## ⚠️ KESALAHAN: Key Tidak Sesuai Environment

Karena environment adalah **sandbox**, maka key HARUS diawali dengan `SB-`.

## ✅ SOLUSI: Tambahkan Prefix "SB-"

Ubah key Anda menjadi:
- Client Key: `SB-Mid-client-O4BSv-VRsgEz-DUS`
- Server Key: `SB-Mid-server-ZHGRfqs8OPbgM6xiTb-5Kurg`

## 📝 Environment Variables yang Benar

Masukkan nilai ini ke Vercel atau v0 Vars section:

\`\`\`env
MIDTRANS_SERVER_KEY=SB-Mid-server-ZHGRfqs8OPbgM6xiTb-5Kurg
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-O4BSv-VRsgEz-DUS
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox
\`\`\`

## 🎯 Cara Update di v0

1. Klik icon "⚙️ Settings" di sidebar kiri chat ini
2. Klik tab "Vars"
3. Cari variable yang sudah ada atau klik "Add Variable"
4. Masukkan KEY dan VALUE seperti di atas
5. Klik "Save"

## 🔄 Perbedaan Sandbox vs Production

| Environment | Format Key | Contoh |
|-------------|-----------|---------|
| **Sandbox** (testing) | Diawali `SB-` | `SB-Mid-server-xxx` |
| **Production** (real) | Tanpa `SB-` | `Mid-server-xxx` |

## ✅ Checklist Setelah Update

- [ ] Update `MIDTRANS_SERVER_KEY` dengan prefix "SB-"
- [ ] Update `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` dengan prefix "SB-"
- [ ] Pastikan `NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox`
- [ ] Redeploy aplikasi (Vercel akan auto-deploy setelah update env vars)
- [ ] Test payment dengan kartu dummy: `4811 1111 1111 1114`

## 🧪 Testing Payment

Setelah update keys, test dengan data dummy ini:

**Credit Card:**
- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Exp: `12/25` (bulan/tahun apa saja di masa depan)
- OTP: `112233`

**Bank Transfer:**
- Pilih bank apa saja
- Gunakan Midtrans Simulator untuk konfirmasi pembayaran:
  https://simulator.sandbox.midtrans.com/

## ❓ FAQ

**Q: Kenapa harus pakai "SB-" untuk sandbox?**
A: Ini adalah standard Midtrans untuk membedakan testing vs production keys secara eksplisit.

**Q: Bagaimana jika saya mau go live?**
A: Toggle ke Production di Midtrans dashboard, ambil keys baru (tanpa "SB-"), update environment variables.

**Q: Apakah aman menyimpan keys di environment variables?**
A: Ya, sangat aman. Vercel enkripsi semua environment variables. Yang public hanya NEXT_PUBLIC_MIDTRANS_CLIENT_KEY (memang designed untuk client-side).

**Q: Bagaimana cara cek apakah keys sudah benar?**
A: Coba lakukan test payment. Jika muncul error "Invalid signature" atau "Access denied", berarti format key salah.

## 🆘 Butuh Bantuan?

Jika masih ada error setelah update keys:
1. Screenshot error message
2. Cek Vercel logs: https://vercel.com/dashboard → Your Project → Logs
3. Cek Midtrans logs: Dashboard → Transactions
4. Tanya ke support Midtrans: https://midtrans.com/contact-us
