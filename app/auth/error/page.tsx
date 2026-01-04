import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-semibold">Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">Kode error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">Terjadi kesalahan yang tidak diketahui.</p>
            )}

            <Button asChild className="w-full">
              <Link href="/auth/login">Kembali ke Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
