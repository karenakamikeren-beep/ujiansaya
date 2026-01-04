import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { grantReferralRewards } from "@/lib/referral-rewards"
import { emailTemplates } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { attemptId } = await request.json()

    // Get attempt details
    const { data: attempt } = await supabase
      .from("tryout_attempts")
      .select(
        `
        *,
        tryouts (title, slug, category)
      `,
      )
      .eq("id", attemptId)
      .single()

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    // Check if this is first completed tryout for referral rewards
    const { data: previousAttempts } = await supabase
      .from("tryout_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_completed", true)

    const isFirstTryout = previousAttempts?.length === 1 // Including this one

    if (isFirstTryout) {
      // Grant referral rewards if applicable
      await grantReferralRewards(user.id)
    }

    // Queue completion email
    await supabase.from("email_queue").insert({
      to_email: profile?.email || user.email,
      subject: `Hasil Tryout: ${attempt.tryouts.title}`,
      body: emailTemplates.tryoutCompleted(
        profile?.full_name || "User",
        attempt.tryouts.title,
        attempt.score || 0,
        attempt.is_passed,
      ),
      type: "tryout_completed",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Complete tryout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
