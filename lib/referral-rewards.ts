import { createServerClient } from "@/lib/supabase/server"
import { emailTemplates } from "@/lib/email"

export async function grantReferralRewards(referredUserId: string) {
  const supabase = await createServerClient()

  // Get referral record
  const { data: referral } = await supabase
    .from("referrals")
    .select(`
      *,
      referrer:user_profiles!referrals_referrer_id_fkey(user_id, email, full_name),
      referred:user_profiles!referrals_referred_id_fkey(user_id, email, full_name)
    `)
    .eq("referred_id", referredUserId)
    .eq("reward_status", "pending")
    .single()

  if (!referral) {
    return { success: false, message: "No pending referral found" }
  }

  try {
    // Grant 7 days premium to referrer
    const { data: referrerSub } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", referral.referrer_id)
      .single()

    if (referrerSub) {
      const currentExpiry = new Date(referrerSub.premium_end_date || new Date())
      const newExpiry = new Date(currentExpiry.getTime() + 7 * 24 * 60 * 60 * 1000)

      await supabase
        .from("user_subscriptions")
        .update({
          is_premium: true,
          premium_end_date: newExpiry.toISOString(),
        })
        .eq("user_id", referral.referrer_id)
    }

    // Grant 3 days premium to referred user
    const { data: referredSub } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", referredUserId)
      .single()

    if (referredSub) {
      const currentExpiry = new Date(referredSub.premium_end_date || new Date())
      const newExpiry = new Date(currentExpiry.getTime() + 3 * 24 * 60 * 60 * 1000)

      await supabase
        .from("user_subscriptions")
        .update({
          is_premium: true,
          premium_end_date: newExpiry.toISOString(),
        })
        .eq("user_id", referredUserId)
    }

    // Update referral status
    await supabase.from("referrals").update({ reward_status: "granted" }).eq("id", referral.id)

    // Queue email to referrer
    await supabase.from("email_queue").insert({
      to_email: referral.referrer.email,
      subject: "Referral Berhasil - Dapatkan 7 Hari Premium!",
      body: emailTemplates.referralSuccess(referral.referrer.full_name, referral.referred.full_name, 7),
      type: "referral_success",
    })

    return { success: true }
  } catch (error) {
    console.error("Grant referral rewards error:", error)
    return { success: false, error }
  }
}
