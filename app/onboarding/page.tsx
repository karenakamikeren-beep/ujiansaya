"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { GraduationCap, User, CheckCircle2 } from "lucide-react"

const educationLevels = [
  { value: "SD", label: "SD (Sekolah Dasar)" },
  { value: "SMP", label: "SMP (Sekolah Menengah Pertama)" },
  { value: "SMA", label: "SMA (Sekolah Menengah Atas)" },
  { value: "UTBK", label: "UTBK (Persiapan Perguruan Tinggi)" },
  { value: "CPNS", label: "CPNS (Calon Pegawai Negeri Sipil)" },
  { value: "KEDINASAN", label: "Kedinasan (Sekolah Kedinasan)" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [educationLevel, setEducationLevel] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleComplete = async () => {
    if (!educationLevel) {
      setError("Silakan pilih jenjang pendidikan")
      return
    }

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          education_level: educationLevel,
          phone: phone || null,
          has_completed_onboarding: true,
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Selamat Datang di TryoutPro!</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Mari lengkapi profil Anda untuk pengalaman yang lebih baik
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
            </div>
            <span className="text-sm font-medium">Jenjang</span>
          </div>

          <div className={`h-0.5 w-12 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />

          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
            </div>
            <span className="text-sm font-medium">Kontak</span>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          {step === 1 && (
            <>
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Pilih Jenjang Pendidikan</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Kami akan menyesuaikan konten tryout sesuai kebutuhan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-medium">
                    Jenjang Pendidikan
                  </Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger id="education" className="w-full">
                      <SelectValue placeholder="Pilih jenjang pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <Button
                  onClick={() => {
                    if (!educationLevel) {
                      setError("Silakan pilih jenjang pendidikan")
                      return
                    }
                    setError(null)
                    setStep(2)
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Lanjut
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Informasi Kontak</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Opsional - Untuk notifikasi dan pembaruan penting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Nomor Telepon (Opsional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                  />
                </div>

                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                <div className="flex gap-3">
                  <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                    Kembali
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Selesai"}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
