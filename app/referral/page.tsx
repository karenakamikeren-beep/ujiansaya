import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ReferralClient from "@/components/referral-client"

export default async function ReferralPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with referral code
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("referral_code, referred_by")
    .eq("user_id", user.id)
    .single()

  // Get referral stats
  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false })

  const totalReferrals = referrals?.length || 0
  const completedReferrals = referrals?.filter((r) => r.reward_status === "granted").length || 0

  const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/register?ref=${profile?.referral_code}`

  return (
    <ReferralClient
      referralCode={profile?.referral_code || ""}
      referralUrl={referralUrl}
      totalReferrals={totalReferrals}
      completedReferrals={completedReferrals}
      referrals={referrals || []}
    />
  )
}
