import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExamInterface } from "@/components/exam-interface"

export default async function StartTryoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get tryout
  const { data: tryout, error: tryoutError } = await supabase
    .from("tryouts")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (tryoutError || !tryout) {
    redirect("/catalog")
  }

  // Check premium access
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("is_premium, premium_end_date")
    .eq("user_id", user.id)
    .single()

  const isPremium =
    subscription?.is_premium && (!subscription.premium_end_date || new Date(subscription.premium_end_date) > new Date())

  if (tryout.is_premium && !isPremium) {
    redirect(`/tryout/${slug}`)
  }

  // Get questions
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("tryout_id", tryout.id)
    .order("question_number", { ascending: true })

  if (questionsError || !questions || questions.length === 0) {
    redirect(`/tryout/${slug}`)
  }

  // Create or get existing attempt
  let attemptId: string

  // Check for existing incomplete attempt
  const { data: existingAttempt } = await supabase
    .from("tryout_attempts")
    .select("id")
    .eq("user_id", user.id)
    .eq("tryout_id", tryout.id)
    .eq("is_completed", false)
    .order("started_at", { ascending: false })
    .limit(1)
    .single()

  if (existingAttempt) {
    attemptId = existingAttempt.id
  } else {
    // Create new attempt
    const { data: newAttempt, error: attemptError } = await supabase
      .from("tryout_attempts")
      .insert({
        user_id: user.id,
        tryout_id: tryout.id,
        total_questions: questions.length,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (attemptError || !newAttempt) {
      redirect(`/tryout/${slug}`)
    }

    attemptId = newAttempt.id
  }

  // Get existing answers
  const { data: existingAnswers } = await supabase.from("answers").select("*").eq("attempt_id", attemptId)

  return (
    <ExamInterface
      tryout={tryout}
      questions={questions}
      attemptId={attemptId}
      existingAnswers={existingAnswers || []}
      isPremium={isPremium}
    />
  )
}
