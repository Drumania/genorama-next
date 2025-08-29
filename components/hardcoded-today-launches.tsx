"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type ItemType = "Video" | "Álbum" | "Single"

const TYPES: ItemType[] = ["Video", "Álbum", "Single"]

// Important: Keep initial render deterministic for SSR hydration.
// We avoid Math.random() at module scope to prevent hydration mismatch.
const BASE_TODAY_ITEMS = Array.from({ length: 10 }).map((_, i) => ({
  id: `today-${i + 1}`,
  title: `Lanzamiento de Hoy #${i + 1}`,
  artist: `Artista Hoy #${i + 1}`,
  username: `artista${i + 1}`,
  type: TYPES[i % TYPES.length] as ItemType,
  cover: `/placeholder.svg?height=80&width=80&query=today+${i + 1}`,
  votes: 0,
}))

export function HardcodedTodayLaunches() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [items, setItems] = useState(BASE_TODAY_ITEMS)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
    // Populate demo votes after mount to avoid SSR/CSR mismatch
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        votes: Math.floor(Math.random() * 200) + 1,
      }))
    )
  }, [])

  const handleVote = () => {
    if (!isAuthenticated) {
      router.push("/auth/signup?tab=login")
      return
    }
    alert("Voto de demostración en la lista hardcodeada")
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Lanzamientos de Hoy</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors"
          >
            {/* Vote */}
            <div className="flex flex-col items-center">
              <Button variant="outline" size="sm" onClick={handleVote}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="text-xs text-muted-foreground mt-1">{item.votes}</div>
            </div>

            {/* Cover */}
            <div className="shrink-0">
              <Image
                src={item.cover}
                alt={`${item.title} por ${item.artist}`}
                width={64}
                height={64}
                className="rounded object-cover"
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{item.type}</Badge>
                <Link href={`/banda/${item.username}`} className="truncate">
                  <span className="font-semibold text-foreground hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </Link>
              </div>
              <Link href={`/banda/${item.username}`} className="block text-sm text-muted-foreground truncate">
                {item.artist} · @{item.username}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
