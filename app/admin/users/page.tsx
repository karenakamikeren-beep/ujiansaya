import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Crown, Mail } from "lucide-react"

export default async function ManageUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from("users")
    .select(
      `
      *,
      user_subscriptions (is_premium, premium_end_date)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
              <p className="text-sm text-muted-foreground">View and manage all users</p>
            </div>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Total: {users?.length || 0} users</CardDescription>
          </CardHeader>
          <CardContent>
            {!users || users.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No users yet</div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => {
                  const isPremium =
                    user.user_subscriptions?.is_premium &&
                    (!user.user_subscriptions.premium_end_date ||
                      new Date(user.user_subscriptions.premium_end_date) > new Date())

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-foreground">{user.full_name || "Anonymous"}</div>
                          {isPremium && (
                            <Badge className="gap-1 bg-yellow-500 text-white">
                              <Crown className="h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                          {user.education_level && <Badge variant="secondary">{user.education_level}</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Joined: {new Date(user.created_at).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        {user.referral_code && (
                          <div className="text-muted-foreground">
                            Referral: <span className="font-mono font-semibold">{user.referral_code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
