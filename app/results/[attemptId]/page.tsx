import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { CheckCircle2, XCircle, MinusCircle, Clock, TrendingUp, Trophy, Download, Eye, Home } from "lucide-react"

export default async function ResultsPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get attempt with tryout details
  const { data: attempt, error } = await supabase
    .from("tryout_attempts")
    .select(
      `
      *,
      tryouts (
        id,
        title,
        slug,
        category,
        passing_score,
        is_premium
      )
    `,
    )
    .eq("id", attemptId)
    .single()

  if (error || !attempt || attempt.user_id !== user.id) {
    redirect("/dashboard")
  }

  // Get all answers with questions
  const { data: answers } = await supabase
    .from("answers")
    .select(
      `
      *,
      questions (
        id,
        question_number,
        question_text,
        topic,
        correct_answer,
        explanation,
        explanation_image_url
      )
    `,
    )
    .eq("attempt_id", attemptId)
    .order("questions(question_number)")

  // Calculate topic performance
  const topicStats: Record<string, { correct: number; total: number }> = {}

  answers?.forEach((answer) => {
    const topic = answer.questions.topic || "Lainnya"
    if (!topicStats[topic]) {
      topicStats[topic] = { correct: 0, total: 0 }
    }
    topicStats[topic].total++
    if (answer.is_correct) {
      topicStats[topic].correct++
    }
  })

  const weakTopics = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      accuracy: (stats.correct / stats.total) * 100,
      correct: stats.correct,
      total: stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  // Check if user is premium
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("is_premium, premium_end_date")
    .eq("user_id", user.id)
    .single()

  const isPremium =
    subscription?.is_premium && (!subscription.premium_end_date || new Date(subscription.premium_end_date) > new Date())

  const canViewExplanation = isPremium && attempt.tryouts.is_premium

  // Get rank
  const { data: allAttempts } = await supabase
    .from("tryout_attempts")
    .select("id, score, time_spent_seconds")
    .eq("tryout_id", attempt.tryouts.id)
    .eq("is_completed", true)
    .order("score", { ascending: false })
    .order("time_spent_seconds", { ascending: true })

  const rank = allAttempts?.findIndex((a) => a.id === attemptId) ?? -1

  return (
    <div className="min-h-screen bg-muted/40 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Hasil Tryout</h1>
          <p className="mt-2 text-lg text-muted-foreground">{attempt.tryouts.title}</p>
        </div>

        <div className="space-y-6">
          {/* Score Card */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left - Main Score */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div
                    className={`flex h-32 w-32 items-center justify-center rounded-full ${
                      attempt.is_passed ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <div>
                      <div className="text-4xl font-bold">{attempt.score?.toFixed(0)}</div>
                      <div className="text-sm">/ 100</div>
                    </div>
                  </div>
                  <div>
                    <Badge
                      className={`text-base ${attempt.is_passed ? "bg-success text-white" : "bg-destructive text-white"}`}
                    >
                      {attempt.is_passed ? "LULUS" : "BELUM LULUS"}
                    </Badge>
                    <p className="mt-2 text-sm text-muted-foreground">Passing score: {attempt.tryouts.passing_score}</p>
                  </div>
                </div>

                {/* Right - Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Benar</div>
                        <div className="text-xl font-bold text-foreground">{attempt.total_correct}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((attempt.total_correct / attempt.total_questions) * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                        <XCircle className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Salah</div>
                        <div className="text-xl font-bold text-foreground">{attempt.total_wrong}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((attempt.total_wrong / attempt.total_questions) * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted-foreground/10">
                        <MinusCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tidak Dijawab</div>
                        <div className="text-xl font-bold text-foreground">{attempt.total_unanswered}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((attempt.total_unanswered / attempt.total_questions) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Waktu Pengerjaan</div>
                    <div className="font-semibold text-foreground">
                      {Math.floor(attempt.time_spent_seconds / 60)} menit {attempt.time_spent_seconds % 60} detik
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Peringkat Anda</div>
                    <div className="font-semibold text-foreground">
                      #{rank + 1} dari {allAttempts?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weak Topics */}
          {weakTopics.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Analisis Topik Lemah</CardTitle>
                <CardDescription>Fokus belajar di topik dengan akurasi rendah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weakTopics.map((topic) => (
                  <div key={topic.topic} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {topic.correct}/{topic.total}
                        </span>
                        <span className={`font-semibold ${topic.accuracy >= 60 ? "text-success" : "text-destructive"}`}>
                          {topic.accuracy.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={topic.accuracy}
                      className={`h-2 ${topic.accuracy >= 60 ? "[&>div]:bg-success" : "[&>div]:bg-destructive"}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Review Answers */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Review Jawaban</CardTitle>
              <CardDescription>Lihat pembahasan untuk setiap soal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {answers?.map((answer) => {
                const isCorrect = answer.is_correct
                const isAnswered = !!answer.selected_answer

                return (
                  <div
                    key={answer.id}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      isCorrect
                        ? "border-success/30 bg-success/5"
                        : isAnswered
                          ? "border-destructive/30 bg-destructive/5"
                          : "border-border bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : isAnswered ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <MinusCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">Soal {answer.questions.question_number}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {answer.questions.question_text}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {answer.selected_answer && (
                        <Badge variant="outline">
                          Jawaban: {answer.selected_answer}
                          {!isCorrect && ` → ${answer.questions.correct_answer}`}
                        </Badge>
                      )}
                      {canViewExplanation && answer.questions.explanation && (
                        <Button asChild size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Link href={`/results/${attemptId}/review/${answer.questions.id}`}>
                            <Eye className="h-4 w-4" />
                            Lihat
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                Kembali ke Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <Link href={`/tryout/${attempt.tryouts.slug}`}>
                <TrendingUp className="h-4 w-4" />
                Coba Lagi
              </Link>
            </Button>
            {attempt.is_passed && isPremium && (
              <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
                <Link href={`/certificate/${attemptId}`}>
                  <Download className="h-4 w-4" />
                  Download Sertifikat
                </Link>
              </Button>
            )}
          </div>

          {/* Upgrade CTA for non-premium */}
          {!canViewExplanation && attempt.tryouts.is_premium && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Upgrade ke Premium</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Akses pembahasan lengkap, sertifikat digital, dan fitur eksklusif lainnya
                    </p>
                  </div>
                  <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Link href="/pricing">Upgrade Sekarang</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
