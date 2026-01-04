"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Users, Gift, Copy, Check } from "lucide-react"
import Link from "next/link"

interface Referral {
  id: string
  created_at: string
  reward_status: string
}

interface ReferralClientProps {
  referralCode: string
  referralUrl: string
  totalReferrals: number
  completedReferrals: number
  referrals: Referral[]
}

export default function ReferralClient({
  referralCode,
  referralUrl,
  totalReferrals,
  completedReferrals,
  referrals,
}: ReferralClientProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">Ajak Teman, Dapat Reward</h1>
          <p className="text-lg text-muted-foreground">
            Dapatkan 7 hari Premium gratis untuk setiap teman yang bergabung menggunakan kode Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referral</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReferrals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Didapat</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReferrals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bonus</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReferrals * 7} Hari</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Kode Referral Anda</CardTitle>
            <CardDescription>Bagikan kode atau link ini kepada teman-teman Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kode Referral</label>
              <div className="flex gap-2">
                <Input value={referralCode} readOnly className="font-mono text-lg" />
                <Button variant="outline" onClick={handleCopyCode}>
                  {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Link Referral</label>
              <div className="flex gap-2">
                <Input value={referralUrl} readOnly className="text-sm" />
                <Button variant="outline" onClick={handleCopyUrl}>
                  {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Yuk gabung TryoutPro! Platform tryout online terbaik untuk persiapan ujian. Daftar pakai kode referral aku: ${referralCode} untuk bonus spesial! ${referralUrl}`,
                  )}`}
                  target="_blank"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan via WhatsApp
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Yuk gabung TryoutPro! Platform tryout online terbaik. Daftar pakai kode referral aku: ${referralCode} ${referralUrl}`,
                  )}`}
                  target="_blank"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan via Twitter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cara Kerja Program Referral</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
              <li>Bagikan kode referral atau link Anda kepada teman</li>
              <li>Teman mendaftar menggunakan kode referral Anda</li>
              <li>Setelah teman menyelesaikan 1 tryout, reward akan otomatis masuk</li>
              <li>Anda mendapat 7 hari Premium gratis untuk setiap referral yang berhasil</li>
              <li>Teman Anda juga mendapat bonus 3 hari Premium gratis</li>
            </ol>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Referral</CardTitle>
            <CardDescription>Daftar teman yang telah bergabung menggunakan kode Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals && referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Referral #{referral.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(referral.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {referral.reward_status === "granted" ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Reward Diterima</span>
                        </div>
                      ) : (
                        <span className="text-sm text-amber-600 font-medium">Menunggu Tryout</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada referral. Mulai ajak teman Anda sekarang!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
