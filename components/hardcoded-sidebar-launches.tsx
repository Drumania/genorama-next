import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SIDEBAR_ITEMS = Array.from({ length: 15 }).map((_, i) => ({
  id: `side-${i + 1}`,
  title: `Destacado #${i + 1}`,
  artist: `Artista ${i + 1}`,
  genre: ["Rock", "Pop", "Indie", "Electrónica", "Hip-Hop"][i % 5],
  cover: `/placeholder.svg?height=120&width=120&query=destacado+${i + 1}`,
}))

export function HardcodedSidebarLaunches() {
  return (
    <aside>
      <h2 className="text-2xl font-bold mb-6">Lanzamientos Destacados</h2>
      <div className="space-y-4">
        {SIDEBAR_ITEMS.map((item) => (
          <Card key={item.id} className="border-border">
            <CardContent className="p-3 flex items-center gap-3">
              <Image
                src={item.cover}
                alt={`${item.title} por ${item.artist}`}
                width={64}
                height={64}
                className="rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <Badge variant="secondary" className="shrink-0">{item.genre}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  )
}

