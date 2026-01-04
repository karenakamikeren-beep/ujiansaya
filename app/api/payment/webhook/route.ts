import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const orderId = body.order_id
    const statusCode = body.status_code
    const grossAmount = body.gross_amount
    const signatureKey = body.signature_key

    const hash = crypto
      .createHash("sha512")
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest("hex")

    if (hash !== signatureKey) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Get payment
    const { data: payment } = await supabase.from("payments").select("*").eq("order_id", orderId).single()

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment status
    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status

    let status = "pending"
    if (transactionStatus === "capture") {
      status = fraudStatus === "accept" ? "settlement" : "pending"
    } else if (transactionStatus === "settlement") {
      status = "settlement"
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      status = "cancel"
    }

    await supabase
      .from("payments")
      .update({
        transaction_id: body.transaction_id,
        transaction_status: status,
        payment_type: body.payment_type,
        paid_at: status === "settlement" ? new Date().toISOString() : null,
        midtrans_response: body,
      })
      .eq("id", payment.id)

    // If payment successful, update subscription
    if (status === "settlement") {
      const duration = payment.subscription_type === "monthly" ? 30 : 365
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + duration)

      await supabase
        .from("user_subscriptions")
        .update({
          is_premium: true,
          subscription_type: payment.subscription_type,
          premium_start_date: startDate.toISOString(),
          premium_end_date: endDate.toISOString(),
          payment_id: payment.id,
        })
        .eq("user_id", payment.user_id)
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
