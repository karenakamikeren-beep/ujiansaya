import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TryoutCard } from "@/components/tryout-card"
import { TryoutFilters } from "@/components/tryout-filters"

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase.from("tryouts").select("*").eq("is_active", true).order("created_at", { ascending: false })

  // Apply filters
  if (params.category) {
    query = query.eq("category", params.category)
  }

  if (params.type === "free") {
    query = query.eq("is_premium", false)
  } else if (params.type === "premium") {
    query = query.eq("is_premium", true)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  const { data: tryouts, error } = await query

  if (error) {
    console.error("Error fetching tryouts:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Katalog Tryout</h1>
            <p className="text-lg text-muted-foreground">
              Pilih tryout sesuai kebutuhan Anda dan mulai berlatih sekarang
            </p>
          </div>

          {/* Filters */}
          <TryoutFilters />

          {/* Results */}
          <div className="mt-8">
            {!tryouts || tryouts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-12 text-center">
                <p className="text-muted-foreground">Tidak ada tryout yang ditemukan. Coba filter lain.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">Menampilkan {tryouts.length} tryout</div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tryouts.map((tryout) => (
                    <TryoutCard key={tryout.id} tryout={tryout} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
