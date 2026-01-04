import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"TryoutPro" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Send email error:", error)
    return { success: false, error }
  }
}

export const emailTemplates = {
  tryoutCompleted: (name: string, tryoutTitle: string, score: number, isPassed: boolean) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .score { font-size: 48px; font-weight: bold; color: ${isPassed ? "#16a34a" : "#dc2626"}; text-align: center; margin: 20px 0; }
          .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; background: ${isPassed ? "#16a34a" : "#dc2626"}; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hasil Tryout Anda</h1>
          </div>
          <div class="content">
            <p>Halo ${name},</p>
            <p>Anda telah menyelesaikan tryout: <strong>${tryoutTitle}</strong></p>
            <div class="score">${score.toFixed(0)}</div>
            <p style="text-align: center;">
              <span class="badge">${isPassed ? "LULUS" : "BELUM LULUS"}</span>
            </p>
            <p>${isPassed ? "Selamat! Anda berhasil lulus tryout ini." : "Jangan menyerah! Terus berlatih untuk hasil yang lebih baik."}</p>
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">Lihat Detail Hasil</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `,

  referralSuccess: (referrerName: string, referredName: string, bonusDays: number) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .reward { font-size: 36px; font-weight: bold; color: #16a34a; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Referral Berhasil!</h1>
          </div>
          <div class="content">
            <p>Halo ${referrerName},</p>
            <p>Selamat! Teman Anda <strong>${referredName}</strong> telah bergabung dan menyelesaikan tryout pertama mereka.</p>
            <div class="reward">+${bonusDays} Hari Premium</div>
            <p style="text-align: center;">Reward telah otomatis ditambahkan ke akun Anda!</p>
            <p>Terus ajak teman untuk mendapatkan lebih banyak reward Premium gratis.</p>
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/referral" class="button">Lihat Referral Anda</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `,

  premiumActivated: (name: string, planType: string, expiryDate: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .crown { font-size: 48px; text-align: center; }
          .feature { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="crown">👑</div>
            <h1>Premium Aktif!</h1>
          </div>
          <div class="content">
            <p>Halo ${name},</p>
            <p>Selamat! Akun Premium Anda telah aktif dengan paket <strong>${planType === "monthly" ? "Bulanan" : "Tahunan"}</strong>.</p>
            <p><strong>Berlaku hingga:</strong> ${new Date(expiryDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            
            <h3>Keuntungan Premium:</h3>
            <div class="feature">✓ Akses semua tryout premium</div>
            <div class="feature">✓ Pembahasan lengkap setiap soal</div>
            <div class="feature">✓ Download sertifikat</div>
            <div class="feature">✓ Analisis topik lemah mendalam</div>
            <div class="feature">✓ Tanpa iklan</div>
            
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/catalog" class="button">Mulai Berlatih</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `,
}
