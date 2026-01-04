import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get leaderboard data
  let query = supabase
    .from("leaderboard_by_category")
    .select("*")
    .lte("rank", 100)
    .order("category", { ascending: true })
    .order("rank", { ascending: true })

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  const { data: leaderboard } = await query

  // Group by tryout
  const groupedData: Record<string, typeof leaderboard> = {}
  leaderboard?.forEach((entry) => {
    if (!groupedData[entry.tryout_title]) {
      groupedData[entry.tryout_title] = []
    }
    groupedData[entry.tryout_title].push(entry)
  })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/40 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Leaderboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">Lihat peringkat peserta terbaik dari seluruh Indonesia</p>
          </div>

          {Object.entries(groupedData).length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Belum ada data leaderboard</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedData).map(([tryoutTitle, entries]) => (
                <Card key={tryoutTitle} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{tryoutTitle}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="secondary">{entries[0]?.category}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {entries.slice(0, 10).map((entry) => (
                        <div
                          key={entry.user_id + entry.rank}
                          className={`flex items-center justify-between rounded-lg border p-4 ${
                            entry.rank <= 3 ? "border-primary/30 bg-primary/5" : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center font-bold text-foreground">
                              {getRankIcon(entry.rank) || `#${entry.rank}`}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{entry.full_name || "Anonymous"}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {entry.is_premium && (
                                  <Badge className="h-5 bg-yellow-500 text-white" variant="secondary">
                                    Premium
                                  </Badge>
                                )}
                                <Clock className="h-3 w-3" />
                                <span>
                                  {Math.floor(entry.time_spent_seconds / 60)}m {entry.time_spent_seconds % 60}s
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{entry.score?.toFixed(0)}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.submitted_at).toLocaleDateString("id-ID")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
