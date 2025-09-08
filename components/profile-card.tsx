import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, Music, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Band } from "@/lib/types"

interface BandCardProps {
  band: Band
}

export function ProfileCard({ band }: BandCardProps) {
  const primaryGenre = band.genres?.[0] || "Music"
  const genreCount = band.genres?.length || 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={band.avatar_url || "/placeholder.svg?height=200&width=300&query=band profile"}
            alt={`${band.name} profile`}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-bold text-lg text-white mb-1">{band.name}</h3>
            <p className="text-white/80 text-sm">@{band.username}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Banda
          </Badge>
          {genreCount > 0 && (
            <Badge variant="outline">
              {primaryGenre}
              {genreCount > 1 && ` +${genreCount - 1}`}
            </Badge>
          )}
        </div>

        {band.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            {band.location}
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {band.description || "No hay descripción disponible"}
        </p>

        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href={`/banda/${band.username}`}>
              Ver Perfil
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {band.spotify_url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={band.spotify_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {band.youtube_url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={band.youtube_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}