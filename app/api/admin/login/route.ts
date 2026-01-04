import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const supabase = await createClient()

    // Get admin user
    const { data: admin, error } = await supabase.from("admins").select("*").eq("username", username).single()

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await supabase.from("admins").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

    // In production, create a proper admin session
    // For now, we'll use the regular auth (simplified for demo)
    return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username } })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
