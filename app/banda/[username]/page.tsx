"use client"

import { getProfileByUsername, getProfileReleases } from "@/lib/supabase/queries"
import { LaunchCard } from "@/components/launch-card"
import { DonationModal } from "@/components/donation-modal"
import { DonationList } from "@/components/donation-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ExternalLink, Globe, Music, Users, Calendar, Heart } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Profile, Release } from "@/lib/types"

interface BandProfilePageProps {
  params: { username: string }
}

export default function BandProfilePage({ params }: BandProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfileByUsername(params.username)
        if (!profileData) {
          notFound()
          return
        }

        const releasesData = await getProfileReleases(profileData.id)

        setProfile(profileData)
        setReleases(releasesData)

        // Check authentication
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error("Error fetching data:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.username])

  const handleDonateClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    setIsDonationModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={profile.avatar_url || "/placeholder.svg?height=400&width=1200&query=music band cover"}
          alt={`${profile.display_name} cover`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <Image
                  src={profile.avatar_url || "/placeholder.svg?height=120&width=120&query=musician avatar"}
                  alt={profile.display_name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white/20 bg-background"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white">{profile.display_name}</h1>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {profile.is_band ? <Users className="h-3 w-3" /> : <Music className="h-3 w-3" />}
                    {profile.is_band ? "Banda" : "Artista"}
                  </Badge>
                </div>

                <p className="text-white/80 text-lg mb-2">@{profile.username}</p>

                <div className="flex flex-wrap items-center gap-4 text-white/70">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Miembro desde {new Date(profile.created_at).getFullYear()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Heart className="h-4 w-4 mr-2" />
                  Seguir
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleDonateClick}>
                  Donar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Acerca de</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || "Este artista aún no ha agregado una biografía."}
                </p>
              </CardContent>
            </Card>

            <DonationList recipient={profile} />

            {/* Releases Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Lanzamientos</h2>
                {releases.length > 0 && (
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                )}
              </div>

              {releases.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {profile.display_name} aún no ha publicado ningún lanzamiento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {releases.map((release) => (
                    <LaunchCard key={release.id} release={release} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Genres */}
            {profile.genres && profile.genres.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Géneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.genres.map((genre) => (
                      <Badge key={genre} variant="outline">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Enlaces</h3>
                <div className="space-y-3">
                  {profile.website_url && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-3" />
                        Sitio Web
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {profile.spotify_url && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href={profile.spotify_url} target="_blank" rel="noopener noreferrer">
                        <Music className="h-4 w-4 mr-3" />
                        Spotify
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {profile.youtube_url && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer">
                        <Music className="h-4 w-4 mr-3" />
                        YouTube
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {profile.instagram_url && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
                        <Music className="h-4 w-4 mr-3" />
                        Instagram
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lanzamientos</span>
                    <span className="font-medium">{releases.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Votos totales</span>
                    <span className="font-medium">
                      {releases.reduce((total, release) => total + release.vote_count, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {profile && (
        <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} recipient={profile} />
      )}
    </div>
  )
}
