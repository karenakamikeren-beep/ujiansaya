import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CertificateGenerator } from "@/components/certificate-generator"

export default async function CertificatePage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get attempt
  const { data: attempt } = await supabase
    .from("tryout_attempts")
    .select(
      `
      *,
      tryouts (title, category)
    `,
    )
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single()

  if (!attempt || !attempt.is_passed) {
    redirect("/dashboard")
  }

  // Get user data
  const { data: userData } = await supabase.from("users").select("full_name").eq("id", user.id).single()

  // Check premium
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("is_premium, premium_end_date")
    .eq("user_id", user.id)
    .single()

  const isPremium =
    subscription?.is_premium && (!subscription.premium_end_date || new Date(subscription.premium_end_date) > new Date())

  if (!isPremium) {
    redirect("/pricing")
  }

  // Get or create certificate
  let certificate
  const { data: existingCert } = await supabase.from("certificates").select("*").eq("attempt_id", attemptId).single()

  if (existingCert) {
    certificate = existingCert
  } else {
    // Generate certificate number
    const certNumber = `CERT/${new Date().getFullYear()}/${String(Date.now()).slice(-6)}`

    const { data: newCert } = await supabase
      .from("certificates")
      .insert({
        attempt_id: attemptId,
        user_id: user.id,
        certificate_number: certNumber,
      })
      .select()
      .single()

    certificate = newCert
  }

  return (
    <CertificateGenerator
      certificateNumber={certificate.certificate_number}
      userName={userData?.full_name || "User"}
      tryoutTitle={attempt.tryouts.title}
      category={attempt.tryouts.category}
      score={attempt.score || 0}
      date={new Date(attempt.submitted_at)}
    />
  )
}
