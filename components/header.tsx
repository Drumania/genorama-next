"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, User, LogOut, Plus, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const [myProfile, setMyProfile] = useState<{ username: string; avatar_url: string | null; display_name: string } | null>(
    null,
  )
  const router = useRouter()
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    const getUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url, display_name")
          .eq("id", user.id)
          .single()
        setMyProfile(profile as any)
      } else {
        setMyProfile(null)
      }

      setIsLoading(false)
    }

    getUserAndProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null
      setUser(nextUser)
      if (nextUser?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url, display_name")
          .eq("id", nextUser.id)
          .single()
        setMyProfile(profile as any)
      } else {
        setMyProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Reset navigating indicator when the route changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  // Prefetch common routes to speed up perceived nav
  useEffect(() => {
    const routes = ["/", "/bandas", "/comunidad", "/eventos", "/donaciones", "/submit", "/auth/signup", "/auth/login"]
    routes.forEach((r) => {
      try {
        // @ts-expect-error: prefetch exists at runtime
        router.prefetch?.(r)
      } catch {}
    })
  }, [router])

  const handleNav = () => setIsNavigating(true)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-[1200px] mx-auto px-4 h-16 flex items-center relative">
        {/* Top progress bar for immediate feedback */}
        <div
          className={`pointer-events-none absolute left-0 right-0 top-0 h-0.5 bg-primary transition-opacity duration-150 ${
            isNavigating ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" prefetch onClick={handleNav} className="flex items-center gap-2">
            <img src={"/logodemoncolita.png"} alt="Genorama" className="h-8 w-8" />
            <span className="text-2xl font-bold text-foreground">Genorama</span>
          </Link>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
          <Link href="/" prefetch onClick={handleNav} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/bandas" prefetch onClick={handleNav} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Bandas
          </Link>
          <Link href="/comunidad" prefetch onClick={handleNav} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Comunidad
          </Link>
          <Link href="/eventos" prefetch onClick={handleNav} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Eventos
          </Link>
        </nav>

        {/* Right: Icons + User */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">

          {isLoading ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {/* Plus menu */}
              <div className="relative group">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-haspopup="menu"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-md z-50">
                  <Link href="/submit" prefetch onClick={handleNav} className="block px-3 py-2 text-sm hover:bg-accent/20">
                    Nuevo lanzamiento
                  </Link>
                  <Link href="/comunidad" prefetch onClick={handleNav} className="block px-3 py-2 text-sm hover:bg-accent/20">
                    Nuevo post
                  </Link>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative group">
                <Button variant="ghost" size="sm" className="rounded-full" aria-haspopup="menu">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all absolute right-0 mt-2 w-64 rounded-md border bg-background shadow-md z-50 p-3 text-sm text-muted-foreground">
                  Sin notificaciones
                </div>
              </div>

              {/* User menu */}
              {myProfile && (
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2" aria-haspopup="menu">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={
                          myProfile.avatar_url ||
                          (user?.user_metadata?.avatar_url as string) ||
                          (user?.user_metadata?.picture as string) ||
                          ""
                        }
                      />
                      <AvatarFallback>{(myProfile.display_name || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">@{myProfile.username}</span>
                  </Button>
                  <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all absolute right-0 mt-2 w-56 rounded-md border bg-background shadow-md z-50 overflow-hidden">
                    <Link href={`/banda/${myProfile.username}`} prefetch onClick={handleNav} className="block px-3 py-2 text-sm hover:bg-accent/20">
                      Perfil
                    </Link>
                    <Link href="/bandas" prefetch onClick={handleNav} className="block px-3 py-2 text-sm hover:bg-accent/20">
                      Mis bandas
                    </Link>
                    <Link href="/" prefetch onClick={handleNav} className="block px-3 py-2 text-sm hover:bg-accent/20">
                      Mis lanzamientos
                    </Link>
                    <Link href="/settings" prefetch onClick={handleNav} className="block px-3 py-2 text-sm hover:bg-accent/20">
                      Settings
                    </Link>
                    <div className="h-px bg-border" />
                    <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm hover:bg-accent/20">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signup?tab=login" prefetch onClick={handleNav}>
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup" prefetch onClick={handleNav}>Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
