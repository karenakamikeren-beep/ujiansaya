import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

export default async function ManageTryoutsPage() {
  const supabase = await createClient()

  const { data: tryouts } = await supabase.from("tryouts").select("*").order("created_at", { ascending: false })

  const categoryColors: Record<string, string> = {
    SD: "bg-blue-500",
    SMP: "bg-green-500",
    SMA: "bg-purple-500",
    UTBK: "bg-orange-500",
    CPNS: "bg-red-500",
    KEDINASAN: "bg-indigo-500",
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Tryouts</h1>
              <p className="text-sm text-muted-foreground">Create and manage all tryouts</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
              <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
                <Link href="/admin/tryouts/create">
                  <Plus className="h-4 w-4" />
                  Create Tryout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Tryouts</CardTitle>
            <CardDescription>Total: {tryouts?.length || 0} tryouts</CardDescription>
          </CardHeader>
          <CardContent>
            {!tryouts || tryouts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No tryouts yet</p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                  <Link href="/admin/tryouts/create">Create First Tryout</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tryouts.map((tryout) => (
                  <div
                    key={tryout.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${categoryColors[tryout.category]} text-white`}>{tryout.category}</Badge>
                        {tryout.is_premium && <Badge className="bg-yellow-500 text-white">Premium</Badge>}
                        {!tryout.is_active && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      <div className="font-medium text-foreground">{tryout.title}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{tryout.total_questions} soal</span>
                        <span>{tryout.duration_minutes} menit</span>
                        <span>{tryout.total_attempts} attempts</span>
                        {tryout.average_score && <span>Avg: {tryout.average_score.toFixed(1)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Link href={`/tryout/${tryout.slug}`}>
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Link href={`/admin/tryouts/${tryout.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
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
