"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, TrendingUp, Trophy, Clock, Target, Crown, Users, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardClientProps {
  user: any
  userData: any
  isPremium: boolean
  recentAttempts: any[]
  totalAttempts: number
  avgScore: number
  passedCount: number
  weakTopicsData: any[]
  totalReferrals: number
  completedReferrals: number
}

export function DashboardClient({
  user,
  userData,
  isPremium,
  recentAttempts,
  totalAttempts,
  avgScore,
  passedCount,
  weakTopicsData,
  totalReferrals,
  completedReferrals,
}: DashboardClientProps) {
  const { toast } = useToast()

  const handleCopyReferralCode = () => {
    if (userData?.referral_code) {
      navigator.clipboard.writeText(userData.referral_code)
      toast({
        title: "Berhasil!",
        description: "Kode referral telah disalin ke clipboard",
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Selamat datang kembali, {userData?.full_name || user.email}!</p>
            </div>
            {isPremium ? (
              <Badge className="gap-1 bg-yellow-500 text-white">
                <Crown className="h-3 w-3" />
                Premium Member
              </Badge>
            ) : (
              <Button asChild className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link href="/pricing">
                  <Crown className="h-4 w-4" />
                  Upgrade Premium
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Tryout</div>
                    <div className="text-2xl font-bold text-foreground">{totalAttempts}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rata-rata Score</div>
                    <div className="text-2xl font-bold text-foreground">{avgScore.toFixed(0)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <Trophy className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Lulus</div>
                    <div className="text-2xl font-bold text-foreground">{passedCount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Jenjang</div>
                    <div className="text-2xl font-bold text-foreground">{userData?.education_level || "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Attempts */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Tryout Terbaru</CardTitle>
                  <CardDescription>Riwayat tryout yang telah Anda selesaikan</CardDescription>
                </CardHeader>
                <CardContent>
                  {!recentAttempts || recentAttempts.length === 0 ? (
                    <div className="py-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">Belum ada tryout yang diselesaikan</p>
                      <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                        <Link href="/catalog">Mulai Tryout</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentAttempts.map((attempt) => (
                        <Link
                          key={attempt.id}
                          href={`/results/${attempt.id}`}
                          className="block rounded-lg border border-border p-4 transition-all hover:border-primary hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="font-medium text-foreground">{attempt.tryouts.title}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="secondary">{attempt.tryouts.category}</Badge>
                                <Clock className="h-3 w-3" />
                                <span>{new Date(attempt.submitted_at).toLocaleDateString("id-ID")}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-2xl font-bold ${attempt.is_passed ? "text-success" : "text-destructive"}`}
                              >
                                {attempt.score?.toFixed(0)}
                              </div>
                              <Badge
                                className={`${attempt.is_passed ? "bg-success text-white" : "bg-destructive text-white"}`}
                              >
                                {attempt.is_passed ? "LULUS" : "GAGAL"}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weak Topics */}
              {weakTopicsData && weakTopicsData.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Topik yang Perlu Dipelajari</CardTitle>
                    <CardDescription>Fokus di area ini untuk hasil lebih baik</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weakTopicsData.map((topic) => (
                      <div key={topic.topic} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{topic.topic}</span>
                          <span className="text-destructive">{topic.accuracy_percent?.toFixed(0)}%</span>
                        </div>
                        <Progress value={topic.accuracy_percent || 0} className="h-2 [&>div]:bg-destructive" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Program Referral</CardTitle>
                  <CardDescription>Ajak teman dan dapatkan reward premium</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Kode Referral</div>
                      <div className="font-mono text-lg font-bold text-foreground">{userData?.referral_code}</div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={handleCopyReferralCode}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg border border-border p-2">
                      <div className="text-2xl font-bold text-primary">{totalReferrals}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="rounded-lg border border-border p-2">
                      <div className="text-2xl font-bold text-success">{completedReferrals}</div>
                      <div className="text-xs text-muted-foreground">Berhasil</div>
                    </div>
                  </div>
                  <Button asChild className="w-full gap-2 bg-transparent" variant="outline">
                    <Link href="/referral">
                      <Users className="h-4 w-4" />
                      Lihat Detail Referral
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Dapatkan 7 hari Premium untuk setiap referral yang menyelesaikan tryout
                  </p>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Link href="/catalog">
                      <BookOpen className="h-4 w-4" />
                      Browse Tryout
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Link href="/leaderboard">
                      <Users className="h-4 w-4" />
                      Leaderboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
