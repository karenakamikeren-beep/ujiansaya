import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutForm } from "@/components/checkout-form"

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const plans = {
    monthly: {
      name: "Monthly Premium",
      price: 49000,
      type: "monthly" as const,
      description: "Akses premium selama 1 bulan",
    },
    yearly: {
      name: "Yearly Premium",
      price: 490000,
      type: "yearly" as const,
      description: "Akses premium selama 1 tahun (Hemat 17%)",
    },
  }

  const selectedPlan = plans[params.plan as keyof typeof plans] || plans.monthly

  return (
    <div className="min-h-screen bg-muted/40 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Lengkapi pembayaran untuk mengaktifkan Premium</p>
        </div>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Detail Paket</CardTitle>
              <CardDescription>Ringkasan paket yang Anda pilih</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{selectedPlan.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedPlan.description}</div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  Rp {selectedPlan.price.toLocaleString("id-ID")}
                </div>
              </div>
            </CardContent>
          </Card>

          <CheckoutForm plan={selectedPlan} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
