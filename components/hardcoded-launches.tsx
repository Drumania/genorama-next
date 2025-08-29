import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ITEMS = Array.from({ length: 15 }).map((_, i) => ({
  id: `hc-${i + 1}`,
  title: `Lanzamiento #${i + 1}`,
  artist: `Artista #${i + 1}`,
  genre: ["Rock", "Pop", "Indie", "Electrónica", "Hip-Hop"][i % 5],
  cover: `/placeholder.svg?height=200&width=300&query=album+${i + 1}`,
  description: "Un nuevo lanzamiento para descubrir.",
}))

export function HardcodedLaunches() {
  return (
    <section className="py-10 px-4">
      <div className="container max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold mb-6">Lanzamientos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border">
              <CardHeader className="p-0">
                <Image
                  src={item.cover}
                  alt={`${item.title} por ${item.artist}`}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                  </div>
                  <Badge variant="secondary">{item.genre}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

