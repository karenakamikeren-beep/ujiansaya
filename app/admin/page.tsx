import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Check admin authentication (in production, implement proper admin auth)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Get analytics summary
  const { data: analytics } = await supabase.from("analytics_summary").select("*").single()

  const { data: conversionData } = await supabase.from("conversion_funnel").select("*").single()

  // Get recent activity
  const { data: recentAttempts } = await supabase
    .from("tryout_attempts")
    .select(
      `
      *,
      users (full_name, email),
      tryouts (title)
    `,
    )
    .eq("is_completed", true)
    .order("submitted_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">TryoutPro Management</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/">View Site</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin/logout">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-2xl font-bold text-foreground">{analytics?.total_users || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Activity className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Premium Users</div>
                  <div className="text-2xl font-bold text-foreground">{analytics?.premium_users || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Active Tryouts</div>
                  <div className="text-2xl font-bold text-foreground">{analytics?.active_tryouts || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-2xl font-bold text-foreground">
                    Rp {((analytics?.total_revenue || 0) / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversion Funnel */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from registration to premium</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="font-medium text-foreground">{conversionData?.total_users || 0}</span>
                  </div>
                  <div className="h-3 rounded-full bg-primary/20">
                    <div className="h-3 rounded-full bg-primary" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attempted Tryout</span>
                    <span className="font-medium text-foreground">{conversionData?.users_attempted || 0}</span>
                  </div>
                  <div className="h-3 rounded-full bg-primary/20">
                    <div
                      className="h-3 rounded-full bg-primary"
                      style={{
                        width: `${((conversionData?.users_attempted || 0) / (conversionData?.total_users || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Premium Users</span>
                    <span className="font-medium text-foreground">{conversionData?.users_premium || 0}</span>
                  </div>
                  <div className="h-3 rounded-full bg-success/20">
                    <div
                      className="h-3 rounded-full bg-success"
                      style={{
                        width: `${((conversionData?.users_premium || 0) / (conversionData?.total_users || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Conversion Rate</div>
                    <div className="text-2xl font-bold text-success">
                      {conversionData?.conversion_rate_percent?.toFixed(1) || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90">
                <Link href="/admin/tryouts/create">Create New Tryout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/admin/tryouts">Manage Tryouts</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/admin/payments">View Payments</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/admin/vouchers">Manage Vouchers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6 border-border">
          <CardHeader>
            <CardTitle>Recent Tryout Attempts</CardTitle>
            <CardDescription>Latest completed tryouts by users</CardDescription>
          </CardHeader>
          <CardContent>
            {!recentAttempts || recentAttempts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No recent activity</div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{attempt.users?.full_name || "Anonymous"}</div>
                      <div className="text-sm text-muted-foreground">
                        {attempt.tryouts?.title} - Score: {attempt.score?.toFixed(0)}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(attempt.submitted_at).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
