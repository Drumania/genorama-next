"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Play, ExternalLink } from "lucide-react"
import { VoteButton } from "@/components/vote-button"
import Image from "next/image"
import type { Release } from "@/lib/types"

interface LaunchCardProps {
  release: Release
}

export function LaunchCard({ release }: LaunchCardProps) {
  const artistName = release.profiles?.display_name || release.profiles?.username || "Unknown Artist"
  const primaryGenre = release.genres?.[0] || "Music"
  const hasUserVoted = !!release.user_vote

  const handlePlayClick = () => {
    if (release.youtube_url) {
      window.open(release.youtube_url, "_blank")
    }
  }

  const handleExternalClick = () => {
    if (release.spotify_url) {
      window.open(release.spotify_url, "_blank")
    } else if (release.apple_music_url) {
      window.open(release.apple_music_url, "_blank")
    } else if (release.soundcloud_url) {
      window.open(release.soundcloud_url, "_blank")
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={release.cover_image_url || "/placeholder.svg?height=200&width=300&query=music album cover"}
            alt={`${release.title} por ${artistName}`}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {release.youtube_url && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button size="sm" className="bg-primary/90 hover:bg-primary" onClick={handlePlayClick}>
                <Play className="h-4 w-4 mr-2" />
                Reproducir
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {release.title}
            </h3>
            <p className="text-muted-foreground text-sm">{artistName}</p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {primaryGenre}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {release.description || "No description available"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VoteButton releaseId={release.id} initialVoteCount={release.vote_count} initialUserVoted={hasUserVoted} />
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {(release.spotify_url || release.apple_music_url || release.soundcloud_url) && (
            <Button variant="ghost" size="sm" onClick={handleExternalClick}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
