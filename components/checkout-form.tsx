"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Loader2 } from "lucide-react"
import { getMidtransConfig, createPayment } from "@/app/actions/payment"

interface CheckoutFormProps {
  plan: {
    name: string
    price: number
    type: "monthly" | "yearly"
  }
  userId: string
}

export function CheckoutForm({ plan, userId }: CheckoutFormProps) {
  const [voucherCode, setVoucherCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [midtransConfig, setMidtransConfig] = useState<{ clientKey: string; environment: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch Midtrans config from server
    const loadConfig = async () => {
      const config = await getMidtransConfig()
      setMidtransConfig(config)

      // Load Midtrans Snap script dynamically
      if (config.clientKey && !isScriptLoaded) {
        const script = document.createElement("script")
        script.src = `https://app.${config.environment === "production" ? "" : "sandbox."}midtrans.com/snap/snap.js`
        script.setAttribute("data-client-key", config.clientKey)
        script.async = true
        script.onload = () => setIsScriptLoaded(true)
        document.body.appendChild(script)

        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script)
          }
        }
      }
    }

    loadConfig()
  }, [isScriptLoaded])

  const handlePayment = async () => {
    if (!isScriptLoaded || !midtransConfig) {
      setError("Payment gateway sedang dimuat. Silakan coba lagi.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await createPayment(plan.type, voucherCode || null)

      if (result.error) {
        throw new Error(result.error)
      }

      // Redirect to Midtrans Snap
      if (result.snap_token && typeof window !== "undefined") {
        // @ts-ignore - Midtrans Snap
        window.snap.pay(result.snap_token, {
          onSuccess: () => {
            router.push("/dashboard?payment=success")
          },
          onPending: () => {
            router.push("/dashboard?payment=pending")
          },
          onError: () => {
            setError("Pembayaran gagal. Silakan coba lagi.")
            setIsProcessing(false)
          },
          onClose: () => {
            setIsProcessing(false)
          },
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Kode Voucher (Opsional)</CardTitle>
          <CardDescription>Masukkan kode voucher jika Anda memilikinya</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voucher">Kode Voucher</Label>
            <Input
              id="voucher"
              placeholder="Masukkan kode voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              disabled={isProcessing}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Metode Pembayaran</CardTitle>
          <CardDescription>Pilih metode pembayaran yang tersedia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <div className="font-medium text-foreground">Midtrans Payment Gateway</div>
                <div className="text-sm text-muted-foreground">Credit Card, Bank Transfer, E-Wallet, dan lainnya</div>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing || !isScriptLoaded}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : !isScriptLoaded ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat Payment Gateway...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Bayar Sekarang - Rp {plan.price.toLocaleString("id-ID")}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami
          </p>
        </CardContent>
      </Card>
    </>
  )
}
