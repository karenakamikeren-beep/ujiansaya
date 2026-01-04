import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold">Verifikasi Email Anda</CardTitle>
            <CardDescription className="text-muted-foreground">
              Kami telah mengirimkan email verifikasi ke inbox Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Silakan cek email Anda dan klik link verifikasi untuk mengaktifkan akun. Jangan lupa cek folder spam jika
              tidak menemukan email kami.
            </p>

            <div className="pt-4">
              <Button asChild className="w-full bg-transparent" variant="outline">
                <Link href="/auth/login">Kembali ke Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
