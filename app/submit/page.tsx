"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Music } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const GENRES = [
  "Rock",
  "Pop",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Folk",
  "Metal",
  "Punk",
  "Blues",
  "Indie",
  "Alternative",
  "Latin",
  "World",
  "Ambient",
]

export default function SubmitPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [appleMusicUrl, setAppleMusicUrl] = useState("")
  const [soundcloudUrl, setSoundcloudUrl] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [tags, setTags] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to submit music")
      }

      // Prepare tags array
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      // Insert release
      const { error: insertError } = await supabase.from("releases").insert({
        title,
        description: description || null,
        artist_id: user.id,
        cover_image_url: coverImageUrl || null,
        youtube_url: youtubeUrl || null,
        spotify_url: spotifyUrl || null,
        apple_music_url: appleMusicUrl || null,
        soundcloud_url: soundcloudUrl || null,
        release_date: releaseDate || null,
        genres: selectedGenres.length > 0 ? selectedGenres : null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        vote_count: 0,
      })

      if (insertError) throw insertError

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Subir Nueva Música</h1>
          <p className="text-muted-foreground">
            Comparte tu música con la comunidad de Genorama y obtén votos de otros músicos y fans.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Detalles del Lanzamiento
            </CardTitle>
            <CardDescription>Completa la información de tu lanzamiento musical</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Nombre de tu canción o álbum"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Cuéntanos sobre tu música, inspiración, proceso creativo..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">URL de Portada</Label>
                <Input
                  id="coverImage"
                  type="url"
                  placeholder="https://ejemplo.com/portada.jpg"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spotify">Spotify URL</Label>
                  <Input
                    id="spotify"
                    type="url"
                    placeholder="https://open.spotify.com/track/..."
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appleMusic">Apple Music URL</Label>
                  <Input
                    id="appleMusic"
                    type="url"
                    placeholder="https://music.apple.com/..."
                    value={appleMusicUrl}
                    onChange={(e) => setAppleMusicUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soundcloud">SoundCloud URL</Label>
                  <Input
                    id="soundcloud"
                    type="url"
                    placeholder="https://soundcloud.com/..."
                    value={soundcloudUrl}
                    onChange={(e) => setSoundcloudUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Fecha de Lanzamiento</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Géneros</Label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                      {selectedGenres.includes(genre) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separados por comas)</Label>
                <Input
                  id="tags"
                  placeholder="experimental, instrumental, colaboración"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Música
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
