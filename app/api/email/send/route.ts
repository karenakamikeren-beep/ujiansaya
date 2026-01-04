import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sendEmail({ to, subject, html })

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Send email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
