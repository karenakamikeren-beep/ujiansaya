import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get subscription status
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("is_premium, premium_end_date")
    .eq("user_id", user.id)
    .single()

  const isPremium =
    subscription?.is_premium && (!subscription.premium_end_date || new Date(subscription.premium_end_date) > new Date())

  // Get recent attempts
  const { data: recentAttempts } = await supabase
    .from("tryout_attempts")
    .select(
      `
      *,
      tryouts (title, slug, category)
    `,
    )
    .eq("user_id", user.id)
    .eq("is_completed", true)
    .order("submitted_at", { ascending: false })
    .limit(5)

  // Get stats
  const totalAttempts = recentAttempts?.length || 0
  const avgScore = recentAttempts?.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / (totalAttempts || 1) || 0
  const passedCount = recentAttempts?.filter((a) => a.is_passed).length || 0

  // Get weak topics
  const { data: weakTopicsData } = await supabase
    .from("user_weak_topics")
    .select("*")
    .eq("user_id", user.id)
    .order("accuracy_percent", { ascending: true })
    .limit(3)

  const { data: referralStats } = await supabase
    .from("referrals")
    .select("id, reward_status")
    .eq("referrer_id", user.id)

  const totalReferrals = referralStats?.length || 0
  const completedReferrals = referralStats?.filter((r) => r.reward_status === "granted").length || 0

  return (
    <DashboardClient
      user={user}
      userData={userData}
      isPremium={isPremium}
      recentAttempts={recentAttempts || []}
      totalAttempts={totalAttempts}
      avgScore={avgScore}
      passedCount={passedCount}
      weakTopicsData={weakTopicsData || []}
      totalReferrals={totalReferrals}
      completedReferrals={completedReferrals}
    />
  )
}
