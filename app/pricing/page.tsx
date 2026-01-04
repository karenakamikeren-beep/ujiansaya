import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { CheckCircle2, Crown, Zap } from "lucide-react"

export default async function PricingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const plans = [
    {
      name: "Monthly",
      price: 49000,
      period: "bulan",
      type: "monthly" as const,
      popular: false,
    },
    {
      name: "Yearly",
      price: 490000,
      period: "tahun",
      type: "yearly" as const,
      popular: true,
      savings: "Hemat 17%",
    },
  ]

  const features = [
    "Akses semua tryout premium",
    "Pembahasan soal lengkap dengan gambar",
    "Sertifikat digital untuk tryout yang lulus",
    "Analisis topik lemah mendalam",
    "Akses leaderboard premium",
    "Tanpa iklan",
    "Update soal terbaru setiap minggu",
    "Prioritas customer support",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/40 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Pilih Paket Premium</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Tingkatkan pengalaman belajar Anda dengan fitur eksklusif
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {plans.map((plan) => (
              <Card
                key={plan.type}
                className={`relative border-border ${plan.popular ? "border-primary ring-2 ring-primary/50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Paling Populer</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  {plan.savings && (
                    <Badge variant="secondary" className="mx-auto mt-2">
                      {plan.savings}
                    </Badge>
                  )}
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-foreground">Rp {plan.price.toLocaleString("id-ID")}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.type === "monthly"
                      ? "Fleksibel, bisa cancel kapan saja"
                      : "Hemat lebih banyak dengan paket tahunan"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <Button
                      asChild
                      className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link href={`/checkout?plan=${plan.type}`}>
                        <Crown className="mr-2 h-4 w-4" />
                        Pilih Paket {plan.name}
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full bg-transparent" size="lg" variant="outline">
                      <Link href="/auth/register">Daftar untuk Melanjutkan</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-foreground">Mengapa Pilih Premium?</h2>
              <p className="text-lg text-muted-foreground">Investasi terbaik untuk masa depan Anda</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Akses Unlimited</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kerjakan semua tryout premium tanpa batas, latihan sebanyak yang Anda mau
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Pembahasan Expert</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pelajari dari pembahasan detail yang dibuat oleh tenaga pengajar berpengalaman
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Sertifikat Resmi</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dapatkan sertifikat digital yang bisa Anda bagikan di LinkedIn atau CV
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
