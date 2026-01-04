# TryoutPro - Premium Educational Platform

Platform tryout online terlengkap untuk persiapan SD, SMP, SMA, UTBK, CPNS, dan Kedinasan.

## Features

### For Users
- Email & Password Authentication
- Free & Premium Tryouts (CAT System)
- Real-time Exam Interface with Timer
- Detailed Results & Analytics
- Certificate Generation (PDF)
- Leaderboard System
- Referral Program
- Premium Subscription (Monthly/Yearly)

### For Admins
- Comprehensive Dashboard
- CRUD Tryouts & Questions
- Bulk Upload via Excel
- User Management
- Payment Tracking
- Voucher Management
- Analytics & Reports
- Audit Logs

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Payment**: Midtrans Snap
- **Email**: Nodemailer
- **PDF**: @react-pdf/renderer
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account
- Midtrans account (for payments)

### Installation

1. **Clone and install dependencies**
```bash
pnpm install
```

2. **Setup Environment Variables**

The following environment variables are already configured in Vercel:
- `SUPABASE_URL` or `NEXT_PUBLIC_TRYOUTPROSUPABASE_URL`
- `SUPABASE_ANON_KEY` or `NEXT_PUBLIC_TRYOUTPROSUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

You need to add these manually:
```env
# Midtrans Payment
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_SERVER_KEY=your_server_key
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox # or production

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App URL
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
```

3. **Setup Database**

Run the SQL scripts in order from the `scripts/` folder using v0's script execution:
- `001_init_database.sql` - Creates all tables with RLS policies
- `002_seed_sample_data.sql` - Adds sample tryouts and questions

Or execute them directly in v0 by clicking the "Run Script" button.

4. **Run Development Server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

- Username: `ADMIN`
- Password: `ADMIN`

**Important**: Change the password immediately after first login at `/admin/settings`

## Project Structure

```
app/
├── auth/               # Authentication pages (login, register, onboarding)
├── admin/              # Admin panel (dashboard, tryouts, users)
├── catalog/            # Tryout listing
├── tryout/[slug]/      # Tryout detail & exam interface
├── results/            # Exam results & analytics
├── certificate/        # Certificate generation
├── dashboard/          # User dashboard
├── pricing/            # Subscription plans
├── referral/           # Referral program
└── api/                # API routes

components/
├── ui/                 # Shadcn UI components
├── navbar.tsx          # Main navigation
├── footer.tsx          # Site footer
├── exam-interface.tsx  # CAT exam UI
├── certificate-generator.tsx
└── checkout-form.tsx   # Midtrans payment

lib/
├── supabase/           # Supabase clients (client, server, proxy)
├── email.tsx           # Email templates & sender
└── utils.ts            # Utility functions

scripts/                # SQL database setup scripts
```

## Key Features Implementation

### 1. Authentication Flow
- Users sign up with email/password
- Email confirmation required (Supabase Auth)
- Automatic profile creation via database trigger
- Onboarding flow for education level
- Row Level Security (RLS) for data protection

### 2. Tryout System (CAT)
- Real-time timer with auto-submit
- Question navigation panel
- Answer review before submit
- Auto-save answers
- Leaderboard ranking

### 3. Premium Features
- First-time users get 1 free premium tryout
- Monthly (Rp 20K) & Yearly (Rp 120K) plans
- Midtrans payment integration
- Webhook for automatic activation
- Ad-free experience for premium users

### 4. Referral Program
- Unique referral code per user
- Rp 5K reward for referrer
- Rp 2K discount for referee
- Automatic tracking via database

### 5. Admin Panel
- Analytics dashboard with charts
- CRUD operations for tryouts/questions
- Bulk upload questions from Excel
- User & payment management
- Voucher system
- Audit logging

## Database Schema

Key tables:
- `users` - User profiles (extends Supabase auth.users)
- `user_subscriptions` - Premium status tracking
- `tryouts` - Exam definitions
- `questions` - Exam questions with explanations
- `tryout_attempts` - User exam sessions
- `answers` - Individual question responses
- `payments` - Midtrans payment tracking
- `certificates` - Generated certificates
- `referrals` - Referral tracking
- `vouchers` - Discount codes

All tables have Row Level Security (RLS) enabled.

## API Routes

- `POST /api/admin/login` - Admin authentication
- `POST /api/payment/webhook` - Midtrans payment callback
- `POST /api/tryout/complete` - Submit exam answers
- `POST /api/email/send` - Send transactional emails
- `GET /api/email/process-queue` - Process email queue

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup

1. Create new Supabase project
2. Run SQL scripts from `scripts/` folder
3. Enable email auth in Supabase dashboard
4. Configure email templates (optional)

### Midtrans Setup

1. Sign up at [midtrans.com](https://midtrans.com)
2. Get Client Key & Server Key from dashboard
3. Add to environment variables
4. Configure webhook URL: `https://your-domain.vercel.app/api/payment/webhook`

## Security Notes

- All user data protected by RLS policies
- Passwords hashed with bcrypt
- Admin authentication separate from user auth
- Payment webhook signature verification
- HTTPS required for production

## Support

For issues or questions:
1. Check existing documentation
2. Review database schema
3. Check Vercel logs for errors
4. Verify environment variables

## License

Proprietary - All rights reserved
