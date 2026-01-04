"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getMidtransConfig() {
  // Server-side only - returns config needed for client
  return {
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    environment: process.env.NEXT_PUBLIC_MIDTRANS_ENVIRONMENT || "sandbox",
  }
}

export async function createPayment(subscriptionType: "monthly" | "yearly", voucherCode?: string | null) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  try {
    // Get user profile
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    if (!profile) {
      return { error: "Profile not found" }
    }

    // Calculate price
    let amount = subscriptionType === "monthly" ? 50000 : 500000
    let discount = 0

    // Apply voucher if provided
    if (voucherCode) {
      const { data: voucher } = await supabase
        .from("vouchers")
        .select("*")
        .eq("code", voucherCode)
        .eq("is_active", true)
        .single()

      if (voucher && (!voucher.expires_at || new Date(voucher.expires_at) > new Date())) {
        discount = voucher.discount_amount || 0
        amount = Math.max(0, amount - discount)

        // Decrement usage
        await supabase
          .from("vouchers")
          .update({ used_count: (voucher.used_count || 0) + 1 })
          .eq("id", voucher.id)
      }
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        subscription_type: subscriptionType,
        amount,
        discount_amount: discount,
        status: "pending",
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // Create Midtrans transaction
    const midtransAuth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64")

    const midtransResponse = await fetch(
      `https://app.${process.env.NEXT_PUBLIC_MIDTRANS_ENVIRONMENT === "production" ? "" : "sandbox."}midtrans.com/snap/v1/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${midtransAuth}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: payment.id,
            gross_amount: amount,
          },
          customer_details: {
            first_name: profile.full_name,
            email: profile.email,
          },
          item_details: [
            {
              id: subscriptionType,
              price: amount,
              quantity: 1,
              name: `TryoutPro ${subscriptionType === "monthly" ? "Monthly" : "Yearly"} Premium`,
            },
          ],
        }),
      },
    )

    const midtransData = await midtransResponse.json()

    if (!midtransResponse.ok) {
      throw new Error(midtransData.error_messages?.[0] || "Failed to create payment")
    }

    // Update payment with Midtrans token
    await supabase.from("payments").update({ midtrans_token: midtransData.token }).eq("id", payment.id)

    return {
      success: true,
      snap_token: midtransData.token,
      payment_id: payment.id,
    }
  } catch (error) {
    console.error("Create payment error:", error)
    return { error: error instanceof Error ? error.message : "Failed to create payment" }
  }
}
