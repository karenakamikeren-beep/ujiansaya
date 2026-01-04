# Quick Start Guide

## Step 1: Database Setup (REQUIRED)

Execute these SQL scripts in order by running them in v0:

1. `scripts/001_init_database.sql` - Creates all tables and RLS policies
2. `scripts/002_seed_sample_data.sql` - Adds sample tryouts and admin user

After running scripts, you'll have:
- Complete database schema with RLS
- Default admin: username `ADMIN`, password `ADMIN`
- 5 sample tryouts with questions

## Step 2: Add Missing Environment Variables

Add these to your Vercel project:

### Required for Payments
```
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
NEXT_PUBLIC_MIDTRANS_ENVIRONMENT=sandbox
```

### Required for Emails
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

### Required for App
```
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
```

## Step 3: Test the Application

### Test User Flow
1. Go to `/auth/register`
2. Create account with email
3. Confirm email (check inbox)
4. Complete onboarding
5. Browse catalog at `/catalog`
6. Take free tryout
7. View results and leaderboard

### Test Admin Flow
1. Go to `/admin/login`
2. Login with `ADMIN` / `ADMIN`
3. View dashboard analytics
4. Manage tryouts at `/admin/tryouts`
5. View users at `/admin/users`

### Test Premium Flow
1. Login as user
2. Go to `/pricing`
3. Select plan
4. Complete payment with Midtrans test card:
   - Card: 4811 1111 1111 1114
   - Exp: 01/25
   - CVV: 123
5. Check premium status in `/dashboard`

## Step 4: Customize

### Update Branding
- Edit `app/layout.tsx` for site metadata
- Replace logo in `public/` folder
- Update color scheme in `app/globals.css`

### Add Your Tryouts
- Go to admin panel
- Create new tryout
- Add questions manually or via Excel upload

### Configure Email Templates
- Edit templates in `lib/email.tsx`
- Test emails in development

## Common Issues

### Issue: "No tables found" in database
**Solution**: Run the SQL scripts in `scripts/` folder

### Issue: Supabase client errors
**Solution**: Check environment variables are set correctly

### Issue: Payment not working
**Solution**: Verify Midtrans credentials and webhook URL

### Issue: Email not sending
**Solution**: Use Gmail App Password, not regular password

## Next Steps

1. Change admin password
2. Add your own tryout content
3. Configure Midtrans production keys
4. Setup custom domain
5. Enable Google Analytics
6. Configure email templates
7. Test all user flows

## Support

Refer to `README.md` for detailed documentation.
