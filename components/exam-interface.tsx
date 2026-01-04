"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Question {
  id: string
  question_number: number
  question_text: string
  question_image_url: string | null
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string | null
}

interface Answer {
  question_id: string
  selected_answer: string
}

interface ExamInterfaceProps {
  tryout: {
    id: string
    title: string
    duration_minutes: number
    slug: string
  }
  questions: Question[]
  attemptId: string
  existingAnswers: Answer[]
  isPremium: boolean
}

export function ExamInterface({ tryout, questions, attemptId, existingAnswers, isPremium }: ExamInterfaceProps) {
  const router = useRouter()
  const supabase = createClient()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(tryout.duration_minutes * 60)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize answers from existing
  useEffect(() => {
    const answerMap: Record<string, string> = {}
    existingAnswers.forEach((ans) => {
      answerMap[ans.question_id] = ans.selected_answer
    })
    setAnswers(answerMap)
  }, [existingAnswers])

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestion.id]

  const handleAnswerSelect = async (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))

    // Save to database
    await supabase.from("answers").upsert({
      attempt_id: attemptId,
      question_id: currentQuestion.id,
      selected_answer: option,
      answered_at: new Date().toISOString(),
    })
  }

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    try {
      // Get all answers with correct answers
      const { data: questionsWithAnswers } = await supabase
        .from("questions")
        .select("id, correct_answer")
        .in(
          "id",
          questions.map((q) => q.id),
        )

      const correctAnswersMap: Record<string, string> = {}
      questionsWithAnswers?.forEach((q) => {
        correctAnswersMap[q.id] = q.correct_answer
      })

      // Calculate score
      let totalCorrect = 0
      let totalWrong = 0
      let totalUnanswered = 0

      const answerUpdates = questions.map((question) => {
        const userAnswer = answers[question.id]
        const correctAnswer = correctAnswersMap[question.id]
        const isCorrect = userAnswer === correctAnswer

        if (!userAnswer) {
          totalUnanswered++
        } else if (isCorrect) {
          totalCorrect++
        } else {
          totalWrong++
        }

        return {
          attempt_id: attemptId,
          question_id: question.id,
          selected_answer: userAnswer || null,
          is_correct: userAnswer ? isCorrect : null,
        }
      })

      // Update all answers with correctness
      await supabase.from("answers").upsert(answerUpdates)

      const score = (totalCorrect / questions.length) * 100

      // Update attempt
      await supabase
        .from("tryout_attempts")
        .update({
          is_completed: true,
          submitted_at: new Date().toISOString(),
          score: score,
          total_correct: totalCorrect,
          total_wrong: totalWrong,
          total_unanswered: totalUnanswered,
          time_spent_seconds: tryout.duration_minutes * 60 - timeRemaining,
          is_passed: score >= 60,
        })
        .eq("id", attemptId)

      // Redirect to results
      router.push(`/results/${attemptId}`)
    } catch (error) {
      console.error("Error submitting:", error)
      setIsSubmitting(false)
    }
  }, [answers, questions, attemptId, timeRemaining, tryout.duration_minutes, supabase, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  return (
    <div className="fixed inset-0 bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div>
            <h1 className="font-semibold text-foreground">{tryout.title}</h1>
            <p className="text-sm text-muted-foreground">
              Soal {currentQuestionIndex + 1} dari {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${timeRemaining < 300 ? "text-destructive" : "text-primary"}`} />
              <span className={`font-mono text-lg font-semibold ${timeRemaining < 300 ? "text-destructive" : ""}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Button onClick={() => setShowSubmitDialog(true)} variant="outline" className="gap-2 bg-transparent">
              <Flag className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Progress */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {answeredCount} / {questions.length} terjawab
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            <Card className="border-border">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <Badge variant="secondary">Soal {currentQuestion.question_number}</Badge>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                      {currentQuestion.question_text}
                    </p>
                  </div>
                  {currentQuestion.question_image_url && (
                    <img
                      src={currentQuestion.question_image_url || "/placeholder.svg"}
                      alt="Question"
                      className="max-w-full rounded-lg border border-border"
                    />
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {["A", "B", "C", "D", "E"].map((option) => {
                    const optionKey = `option_${option.toLowerCase()}` as keyof Question
                    const optionText = currentQuestion[optionKey]

                    if (!optionText) return null

                    const isSelected = selectedAnswer === option

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full rounded-lg border p-4 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-semibold ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground text-muted-foreground"
                            }`}
                          >
                            {option}
                          </div>
                          <span className="text-foreground">{optionText}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Question Navigator */}
        <div className="w-80 border-l border-border bg-muted/40 overflow-y-auto p-6">
          <h3 className="mb-4 font-semibold text-foreground">Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id]
              const isCurrent = index === currentQuestionIndex

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`aspect-square rounded-md border text-sm font-medium transition-all ${
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/50"
                      : isAnswered
                        ? "border-success bg-success/10 text-success hover:bg-success/20"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {question.question_number}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-3 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded border-2 border-success bg-success/10" />
              <span className="text-muted-foreground">Terjawab ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded border-2 border-border bg-background" />
              <span className="text-muted-foreground">Belum dijawab ({questions.length - answeredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Tryout?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Anda akan mengakhiri tryout ini. Pastikan semua jawaban sudah benar.</p>
              <div className="rounded-lg bg-muted p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Soal terjawab:</span>
                  <span className="font-semibold">
                    {answeredCount} / {questions.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sisa waktu:</span>
                  <span className="font-semibold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              {answeredCount < questions.length && (
                <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Masih ada {questions.length - answeredCount} soal yang belum dijawab
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Memproses..." : "Ya, Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
