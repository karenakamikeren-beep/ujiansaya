"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"

interface CertificateGeneratorProps {
  certificateNumber: string
  userName: string
  tryoutTitle: string
  category: string
  score: number
  date: Date
}

export function CertificateGenerator({
  certificateNumber,
  userName,
  tryoutTitle,
  category,
  score,
  date,
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!certificateRef.current) return

    // In production, you would use html2canvas or a similar library
    // For now, we'll just show the download button
    alert("Download sertifikat akan tersedia setelah integrasi dengan library PDF generator")
  }

  return (
    <div className="min-h-screen bg-muted/40 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sertifikat Digital</h1>
            <p className="text-sm text-muted-foreground">No: {certificateNumber}</p>
          </div>
          <Button onClick={handleDownload} className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card
          ref={certificateRef}
          className="border-border bg-white p-12"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="space-y-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-sm font-medium uppercase tracking-wider opacity-90">Sertifikat Penghargaan</div>
              <h2 className="text-5xl font-bold">TryoutPro</h2>
            </div>

            <div className="mx-auto h-1 w-24 bg-white/50" />

            <div className="space-y-2">
              <div className="text-lg opacity-90">Diberikan kepada</div>
              <div className="text-4xl font-bold">{userName}</div>
            </div>

            <div className="mx-auto max-w-2xl space-y-4 text-lg opacity-90">
              <p>Telah menyelesaikan dan lulus</p>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-semibold text-white">{tryoutTitle}</div>
                <div className="mt-2 text-base">
                  Kategori: {category} | Score: {score.toFixed(0)}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div className="text-sm opacity-75">
                Dikeluarkan pada {date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="mt-4 text-xs opacity-75">Nomor Sertifikat: {certificateNumber}</div>
            </div>

            <div className="flex justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="mb-2 h-px w-32 bg-white/50" />
                <div className="text-sm">TryoutPro Official</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
