"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, MessageCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type ItemType = "Video" | "Álbum" | "Single"
const TYPES: ItemType[] = ["Video", "Álbum", "Single"]
const TAGS = ["Rock", "Pop", "Indie", "Electrónica", "Hip-Hop", "Folk", "Experimental", "AI", "Maps", "Food & Drink"]

// Important: Keep initial render deterministic for SSR hydration.
// We avoid Math.random() at module scope to prevent hydration mismatch.
// Create up to 50 base items so we can show 10/20/30/50 per day.
const BASE_TODAY_ITEMS = Array.from({ length: 50 }).map((_, i) => ({
  id: `today-${i + 1}`,
  title: `Lanzamiento de Hoy #${i + 1}`,
  artist: `Artista Hoy #${i + 1}`,
  username: `artista${i + 1}`,
  type: TYPES[i % TYPES.length] as ItemType,
  cover: `/placeholder.svg?height=80&width=80&query=today+${i + 1}`,
  description: `Descripción breve del lanzamiento #${i + 1}. Inspiración, estilo y detalles del track.`,
  tags: [TAGS[i % TAGS.length], TAGS[(i + 3) % TAGS.length], TAGS[(i + 6) % TAGS.length]].slice(0, 3),
  votes: 0,
  comments: 0,
}))

// For demo: total loaded today (e.g., 43)
const TODAY_TOTAL = 43

export function HardcodedTodayLaunches() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [items, setItems] = useState(BASE_TODAY_ITEMS.slice(0, TODAY_TOTAL))
  const [count, setCount] = useState<number>(Math.min(15, TODAY_TOTAL))
  const [revealRange, setRevealRange] = useState<{ start: number; end: number } | null>(null)
  const [revealActive, setRevealActive] = useState(false)
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
    // Populate demo counts after mount to avoid SSR/CSR mismatch
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        votes: Math.floor(Math.random() * 400) + 1,
        comments: Math.floor(Math.random() * 100) + 1,
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

  const visibleItems = useMemo(() => items.slice(0, Math.min(count, items.length)), [items, count])

  const total = items.length

  const handleLoadMore = () => {
    setCount((prev) => {
      const next = Math.min(prev + 15, total)
      setRevealRange({ start: prev, end: next - 1 })
      setRevealActive(false)
      return next
    })
  }

  // Trigger CSS transition after new items mount
  useEffect(() => {
    if (revealRange) {
      const id = setTimeout(() => setRevealActive(true), 0)
      return () => clearTimeout(id)
    }
  }, [revealRange])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lanzamientos de Hoy</h2>
      </div>

      <div className="space-y-2">
        {visibleItems.map((item, idx) => {
          const isNew = revealRange && idx >= revealRange.start && idx <= revealRange.end
          const transitionClasses = isNew && !revealActive ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          return (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 border rounded-xl bg-card hover:bg-accent/10 transition-all duration-300 ${transitionClasses}`}
          >
            {/* Position */}
            <div className="w-6 text-right text-sm font-semibold text-muted-foreground">{idx + 1}.</div>

            {/* Cover */}
            <div className="shrink-0">
              <Image
                src={item.cover}
                alt={`${item.title} por ${item.artist}`}
                width={48}
                height={48}
                className="rounded object-cover"
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/banda/${item.username}`} className="truncate">
                  <span className="font-semibold text-foreground hover:text-primary transition-colors">
                    {item.artist}
                  </span>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {item.tags.map((tag: string) => (
                  <Badge key={`${item.id}-${tag}`} variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right controls: comments and votes */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="px-3 py-2 rounded-xl border text-sm text-muted-foreground bg-background/50 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{item.comments}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVote}
                className="px-3 py-2 rounded-xl border flex items-center gap-2"
              >
                <ChevronUp className="h-4 w-4" />
                <span>{item.votes}</span>
              </Button>
            </div>
          </div>
        )})}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLoadMore}
          className="cursor-pointer disabled:cursor-not-allowed"
          disabled={count >= total}
        >
          {`Ver más (${count} / ${total})`}
        </Button>
      </div>
    </section>
  )
}
