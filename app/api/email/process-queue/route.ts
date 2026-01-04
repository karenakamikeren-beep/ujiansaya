import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()

    // Get pending emails
    const { data: pendingEmails, error } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lt("attempts", 3)
      .limit(10)

    if (error) {
      throw error
    }

    const results = []

    for (const email of pendingEmails || []) {
      try {
        const result = await sendEmail({
          to: email.to_email,
          subject: email.subject,
          html: email.body,
        })

        if (result.success) {
          // Mark as sent
          await supabase
            .from("email_queue")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", email.id)

          results.push({ id: email.id, status: "sent" })
        } else {
          // Increment attempts
          await supabase
            .from("email_queue")
            .update({
              attempts: email.attempts + 1,
              status: email.attempts + 1 >= 3 ? "failed" : "pending",
            })
            .eq("id", email.id)

          results.push({ id: email.id, status: "retry" })
        }
      } catch (emailError) {
        console.error(`Failed to send email ${email.id}:`, emailError)
        results.push({ id: email.id, status: "error" })
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Process email queue error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
