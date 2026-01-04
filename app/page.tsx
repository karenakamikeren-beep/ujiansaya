import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  GraduationCap,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  const categories = [
    { name: "SD", description: "Sekolah Dasar", icon: BookOpen, color: "bg-blue-500" },
    { name: "SMP", description: "Sekolah Menengah Pertama", icon: BookOpen, color: "bg-green-500" },
    { name: "SMA", description: "Sekolah Menengah Atas", icon: BookOpen, color: "bg-purple-500" },
    { name: "UTBK", description: "Persiapan PTN", icon: GraduationCap, color: "bg-orange-500" },
    { name: "CPNS", description: "Calon PNS", icon: Shield, color: "bg-red-500" },
    { name: "Kedinasan", description: "Sekolah Kedinasan", icon: Award, color: "bg-indigo-500" },
  ]

  const features = [
    {
      icon: Target,
      title: "Soal Berkualitas",
      description: "Ribuan soal yang disusun oleh tenaga ahli sesuai standar ujian terbaru",
    },
    {
      icon: BarChart3,
      title: "Analisis Mendalam",
      description: "Laporan detail untuk mengetahui kekuatan dan kelemahan Anda",
    },
    {
      icon: TrendingUp,
      title: "Sistem CAT",
      description: "Simulasi ujian dengan Computer Adaptive Test seperti ujian asli",
    },
    {
      icon: Award,
      title: "Sertifikat Digital",
      description: "Dapatkan sertifikat untuk tryout yang Anda selesaikan",
    },
    {
      icon: Users,
      title: "Leaderboard Real-time",
      description: "Bandingkan kemampuan Anda dengan peserta lain se-Indonesia",
    },
    {
      icon: Zap,
      title: "Akses Fleksibel",
      description: "Kerjakan tryout kapan saja dan dimana saja sesuai jadwal Anda",
    },
  ]

  const stats = [
    { value: "50,000+", label: "Pengguna Aktif" },
    { value: "1,000+", label: "Soal Tryout" },
    { value: "95%", label: "Tingkat Kepuasan" },
    { value: "24/7", label: "Akses Platform" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  Platform Tryout Online Terbaik
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Persiapan Ujian Jadi Lebih Mudah
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Tingkatkan peluang kelulusan Anda dengan ribuan soal tryout, analisis mendalam, dan sistem CAT yang
                  menyerupai ujian asli. Mulai berlatih sekarang!
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/register">
                    Daftar Gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/catalog">Lihat Katalog</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                <div className="space-y-4">
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Tryout Selesai</div>
                          <div className="text-sm text-muted-foreground">Score: 85/100</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Peningkatan Score</div>
                          <div className="text-sm text-success">+15% dari tryout sebelumnya</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Sertifikat Tersedia</div>
                          <div className="text-sm text-muted-foreground">Download sertifikat Anda</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Pilih Jenjang Anda</h2>
            <p className="text-lg text-muted-foreground">
              Kami menyediakan tryout untuk berbagai jenjang pendidikan dan ujian
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={`/catalog?category=${category.name}`}>
                <Card className="group border-border hover:border-primary transition-all hover:shadow-md cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.color}`}>
                        <category.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Mengapa Memilih TryoutPro?
            </h2>
            <p className="text-lg text-muted-foreground">Fitur lengkap untuk membantu Anda mencapai hasil terbaik</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Siap Meningkatkan Performa Anda?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Bergabung dengan ribuan siswa yang telah berhasil meningkatkan score mereka
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/register">Mulai Gratis Sekarang</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Link href="/pricing">Lihat Paket Premium</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
