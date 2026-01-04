"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, Menu, X, User, LayoutDashboard, Users, LogOut, Crown } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("is_premium, premium_end_date")
          .eq("user_id", user.id)
          .single()

        setIsPremium(
          subscription?.is_premium &&
            (!subscription.premium_end_date || new Date(subscription.premium_end_date) > new Date()),
        )
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TryoutPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/catalog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Katalog Tryout
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Harga
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Leaderboard
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      {isPremium && (
                        <p className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Premium Member
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/referral" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      Program Referral
                    </Link>
                  </DropdownMenuItem>
                  {!isPremium && (
                    <DropdownMenuItem asChild>
                      <Link href="/pricing" className="cursor-pointer text-yellow-600">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade Premium
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/auth/login">Masuk</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/register">Daftar Gratis</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/catalog"
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Katalog Tryout
            </Link>
            <Link
              href="/pricing"
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Harga
            </Link>
            <Link
              href="/leaderboard"
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Leaderboard
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Dashboard
                </Link>
                <Link
                  href="/referral"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Program Referral
                </Link>
              </>
            )}
            <div className="flex flex-col gap-2 pt-3">
              {user ? (
                <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                  Keluar
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/auth/login">Masuk</Link>
                  </Button>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href="/auth/register">Daftar Gratis</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
