"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, Search, Calendar, MessageSquare, User, LogOut, Plus, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Genorama</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link
              href="/bandas"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Bandas
            </Link>
            <Link
              href="/comunidad"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Comunidad
            </Link>
            <Link
              href="/eventos"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Eventos
            </Link>
            {user && (
              <Link
                href="/donaciones"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Donaciones
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4" />
          </Button>

          {isLoading ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/donaciones">
                  <Heart className="h-4 w-4 mr-2" />
                  Donaciones
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Música
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
