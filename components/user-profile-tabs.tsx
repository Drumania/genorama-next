"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, MessageSquare, Heart, Gift, ExternalLink, Music, Star } from "lucide-react"
import Link from "next/link"

interface UserProfileTabsProps {
  activeTab: string
  user: any // Mock user data for now
}

export function UserProfileTabs({ activeTab, user }: UserProfileTabsProps) {
  // Mock data for different tabs
  const mockBands = [
    {
      id: 1,
      name: "Los Rockeros del Sur",
      username: "rockeros_sur",
      description: "Banda de rock alternativo con influencias latinas",
      coverImage: "/alternative-rock-band-album-cover-ethereal.png",
      role: "owner"
    }
  ]

  const mockEvents = [
    {
      id: 1,
      title: "Festival de Rock Latino",
      date: "2024-06-15",
      location: "Buenos Aires, Argentina",
      description: "Gran festival de rock latinoamericano"
    }
  ]

  const mockPosts = [
    {
      id: 1,
      title: "¿Cómo mejorar el sonido en vivo?",
      category: "Producción",
      replies: 12,
      views: 156,
      created_at: "2024-01-15"
    }
  ]

  const mockFollowing = [
    {
      id: 1,
      name: "Electro Dreams",
      username: "electro_dreams",
      avatar: "/album-cover-midnight-dreams-electronic-music.png",
      followers: 234
    }
  ]

  const mockDonations = [
    {
      id: 1,
      recipient: "Hip-Hop Urbano",
      amount: 25.00,
      message: "¡Excelente música!",
      date: "2024-01-10"
    }
  ]

  const renderInformacion = () => (
    <div className="space-y-6">
      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
        </CardContent>
      </Card>

      {/* Level Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Nivel de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {user.level}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Continúa participando para subir de nivel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bands Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Music className="h-5 w-5" />
            Mis Bandas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockBands.length > 0 ? (
            <div className="space-y-4">
              {mockBands.map((band) => (
                <div key={band.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={band.coverImage} 
                      alt={band.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{band.name}</h3>
                    <p className="text-sm text-muted-foreground">{band.description}</p>
                    <Badge variant="outline" className="mt-2">{band.role}</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No tienes bandas registradas aún
            </p>
          )}
        </CardContent>
      </Card>

      {/* Links Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {user.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{link.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{link.url}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEventos = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Eventos</h2>
        <Button variant="outline">Crear Evento</Button>
      </div>
      
      {mockEvents.length > 0 ? (
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                  </div>
                  <Button variant="outline" size="sm">Ver Detalles</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay eventos</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has creado ningún evento
            </p>
            <Button>Crear mi primer evento</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderComunidad = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Comunidad</h2>
        <Button variant="outline">Crear Post</Button>
      </div>
      
      {mockPosts.length > 0 ? (
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span>{post.replies} respuestas</span>
                      <span>{post.views} vistas</span>
                      <span>{post.created_at}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Ver Post</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay posts</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has creado ningún post en la comunidad
            </p>
            <Button>Crear mi primer post</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderFan = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Artistas que sigo</h2>
      
      {mockFollowing.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFollowing.map((artist) => (
            <Card key={artist.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={artist.avatar} 
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">@{artist.username}</p>
                    <p className="text-sm text-muted-foreground">{artist.followers} seguidores</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sigues a nadie</h3>
            <p className="text-muted-foreground mb-4">
              Descubre y sigue a artistas que te gusten
            </p>
            <Button>Explorar artistas</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderDonaciones = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Historial de Donaciones</h2>
      
      {mockDonations.length > 0 ? (
        <div className="space-y-4">
          {mockDonations.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{donation.recipient}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{donation.message}</p>
                    <p className="text-sm text-muted-foreground">{donation.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">${donation.amount.toFixed(2)}</p>
                    <Badge variant="secondary" className="mt-1">Completada</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay donaciones</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has realizado ninguna donación
            </p>
            <Button>Explorar artistas para donar</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "informacion":
        return renderInformacion()
      case "eventos":
        return renderEventos()
      case "comunidad":
        return renderComunidad()
      case "fan":
        return renderFan()
      case "donaciones":
        return renderDonaciones()
      default:
        return renderInformacion()
    }
  }

  return (
    <div className="min-h-[400px]">
      {renderContent()}
    </div>
  )
}
