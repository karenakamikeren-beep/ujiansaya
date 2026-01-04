"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState } from "react"

export function TryoutFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/catalog?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/catalog?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    router.push("/catalog")
  }

  const hasFilters = searchParams.get("category") || searchParams.get("type") || searchParams.get("search")

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari tryout..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Cari</Button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select defaultValue={searchParams.get("category") || "all"} onValueChange={(v) => handleFilter("category", v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="SD">SD</SelectItem>
            <SelectItem value="SMP">SMP</SelectItem>
            <SelectItem value="SMA">SMA</SelectItem>
            <SelectItem value="UTBK">UTBK</SelectItem>
            <SelectItem value="CPNS">CPNS</SelectItem>
            <SelectItem value="KEDINASAN">Kedinasan</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={searchParams.get("type") || "all"} onValueChange={(v) => handleFilter("type", v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="free">Gratis</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
