import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, FileText, TrendingUp, Crown } from "lucide-react"

interface Tryout {
  id: string
  title: string
  description: string
  category: string
  duration_minutes: number
  total_questions: number
  is_premium: boolean
  thumbnail_url: string | null
  total_attempts: number
  average_score: number | null
  slug: string
}

export function TryoutCard({ tryout }: { tryout: Tryout }) {
  const categoryColors: Record<string, string> = {
    SD: "bg-blue-500",
    SMP: "bg-green-500",
    SMA: "bg-purple-500",
    UTBK: "bg-orange-500",
    CPNS: "bg-red-500",
    KEDINASAN: "bg-indigo-500",
  }

  return (
    <Card className="group flex flex-col overflow-hidden border-border transition-all hover:border-primary hover:shadow-md">
      {/* Image/Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {tryout.thumbnail_url ? (
          <img
            src={tryout.thumbnail_url || "/placeholder.svg"}
            alt={tryout.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <FileText className="h-16 w-16 text-primary/40" />
          </div>
        )}
        {tryout.is_premium && (
          <div className="absolute top-3 right-3">
            <Badge className="gap-1 bg-yellow-500 text-white hover:bg-yellow-600">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`${categoryColors[tryout.category]} text-white`}>
            {tryout.category}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {tryout.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{tryout.description}</p>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{tryout.duration_minutes} menit</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{tryout.total_questions} soal</span>
          </div>
          {tryout.average_score && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Rata-rata: {tryout.average_score.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/tryout/${tryout.slug}`}>Mulai Tryout</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
