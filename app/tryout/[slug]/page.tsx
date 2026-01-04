import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Target, Crown, Users, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function TryoutDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Get tryout details
  const { data: tryout, error } = await supabase
    .from("tryouts")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !tryout) {
    redirect("/catalog")
  }

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is premium
  let isPremium = false
  if (user) {
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("is_premium, premium_end_date")
      .eq("user_id", user.id)
      .single()

    isPremium =
      subscription?.is_premium &&
      (!subscription.premium_end_date || new Date(subscription.premium_end_date) > new Date())
  }

  const canAccess = !tryout.is_premium || isPremium

  const categoryColors: Record<string, string> = {
    SD: "bg-blue-500",
    SMP: "bg-green-500",
    SMA: "bg-purple-500",
    UTBK: "bg-orange-500",
    CPNS: "bg-red-500",
    KEDINASAN: "bg-indigo-500",
  }

  return (
    <div className="min-h-screen bg-muted/40 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/catalog" className="text-sm font-medium text-primary hover:underline">
            ← Kembali ke Katalog
          </Link>
        </div>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${categoryColors[tryout.category]} text-white`}>{tryout.category}</Badge>
                    {tryout.is_premium && (
                      <Badge className="gap-1 bg-yellow-500 text-white">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl">{tryout.title}</CardTitle>
                  <CardDescription className="text-base">{tryout.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Durasi</div>
                    <div className="font-semibold text-foreground">{tryout.duration_minutes} menit</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Jumlah Soal</div>
                    <div className="font-semibold text-foreground">{tryout.total_questions} soal</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Passing Score</div>
                    <div className="font-semibold text-foreground">{tryout.passing_score}%</div>
                  </div>
                </div>
              </div>

              {tryout.average_score && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Rata-rata score: {tryout.average_score.toFixed(1)}</span>
                  <Users className="ml-4 h-4 w-4" />
                  <span>{tryout.total_attempts} peserta</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Instruksi Tryout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Waktu Terbatas</div>
                  <div className="text-sm text-muted-foreground">
                    Anda memiliki waktu {tryout.duration_minutes} menit untuk menyelesaikan {tryout.total_questions}{" "}
                    soal
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Jawaban Tersimpan Otomatis</div>
                  <div className="text-sm text-muted-foreground">Setiap jawaban akan tersimpan secara otomatis</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Review Jawaban</div>
                  <div className="text-sm text-muted-foreground">
                    Anda dapat mengubah jawaban sebelum waktu habis atau submit
                  </div>
                </div>
              </div>
              {tryout.is_premium && (
                <div className="flex items-start gap-3">
                  <Crown className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Pembahasan Lengkap</div>
                    <div className="text-sm text-muted-foreground">
                      Akses pembahasan detail setelah menyelesaikan tryout (Premium)
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="border-border">
            <CardContent className="pt-6">
              {!user ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">Silakan login untuk mengikuti tryout ini</p>
                  <div className="flex gap-3">
                    <Button asChild className="flex-1 bg-transparent" variant="outline">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                      <Link href="/auth/register">Daftar</Link>
                    </Button>
                  </div>
                </div>
              ) : !canAccess ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-yellow-500/10 p-4 text-center">
                    <Crown className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                    <p className="font-medium text-foreground">Tryout ini khusus untuk member Premium</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upgrade ke Premium untuk akses semua tryout dan fitur eksklusif
                    </p>
                  </div>
                  <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Link href="/pricing">Upgrade ke Premium</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Pastikan Anda sudah siap sebelum memulai tryout
                  </p>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90" size="lg">
                    <Link href={`/tryout/${slug}/start`}>Mulai Tryout Sekarang</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
