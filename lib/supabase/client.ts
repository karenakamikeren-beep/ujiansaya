import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | undefined

export function createClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_TRYOUTPROSUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_TRYOUTPROSUPABASE_PUBLISHABLE_KEY!

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
