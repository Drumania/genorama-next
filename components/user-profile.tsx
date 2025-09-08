"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Users, Activity, Settings, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User, Band, UserBandsSummary, UserStats, UserActivity } from "@/lib/types"

interface UserProfileProps {
  username: string
}

export function UserProfile({ username }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userBands, setUserBands] = useState<UserBandsSummary | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener datos del usuario
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single()

        if (!userData) {
          setIsLoading(false)
          return
        }

        setUser(userData)

        // Verificar si es el usuario actual
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setIsCurrentUser(currentUser?.id === userData.id)

        // Obtener bandas del usuario
        const { data: bandsData } = await supabase
          .from("user_bands_summary")
          .select("*")
          .eq("user_id", userData.id)
          .single()

        setUserBands(bandsData)

        // Obtener estadísticas del usuario
        const { data: statsData } = await supabase
          .from("user_stats")
          .select("*")
          .eq("id", userData.id)
          .single()

        setUserStats(statsData)

        // Obtener actividad del usuario
        const { data: activityData } = await supabase
          .from("user_activity")
          .select("*")
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false })
          .limit(10)

        setUserActivity(activityData || [])

      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [username, supabase])

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-6"></div>
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Usuario no encontrado</h1>
          <p className="text-muted-foreground mt-2">El usuario @{username} no existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header del perfil */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url || ""} />
            <AvatarFallback className="text-2xl">
              {user.display_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{user.display_name}</h1>
                <p className="text-muted-foreground text-lg">@{user.username}</p>
              </div>
              
              {isCurrentUser && (
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva banda
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            
            {user.bio && (
              <p className="text-muted-foreground mb-4">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.location && (
                <span>📍 {user.location}</span>
              )}
                          {user.location && (
              <span>📍 {user.location}</span>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.band_count}</div>
              <div className="text-sm text-muted-foreground">Bandas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.following_count}</div>
              <div className="text-sm text-muted-foreground">Siguiendo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.activity_count}</div>
              <div className="text-sm text-muted-foreground">Actividades</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs de contenido */}
      <Tabs defaultValue="bands" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bands" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Bandas
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Actividad
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Acerca de
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bands" className="space-y-4">
          {userBands && userBands.bands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBands.bands.map((band) => (
                <Card key={band.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={band.avatar_url || ""} />
                        <AvatarFallback>{band.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{band.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">@{band.username}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant={band.role === 'owner' ? 'default' : 'secondary'}>
                        {band.role === 'owner' ? 'Propietario' : 
                         band.role === 'admin' ? 'Administrador' : 'Miembro'}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/banda/${band.username}`}>
                          Ver perfil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin bandas</h3>
                <p className="text-muted-foreground mb-4">
                  {isCurrentUser 
                    ? "Aún no has creado o unido ninguna banda."
                    : "Este usuario aún no tiene bandas."
                  }
                </p>
                {isCurrentUser && (
                  <Button asChild>
                    <Link href="/submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primera banda
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {userActivity.length > 0 ? (
            <div className="space-y-4">
              {userActivity.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.activity_type === 'post_created' && 'Creaste un post'}
                          {activity.activity_type === 'comment_made' && 'Comentaste en un post'}
                          {activity.activity_type === 'donation_made' && 'Hiciste una donación'}
                          {activity.activity_type === 'event_attended' && 'Asististe a un evento'}
                          {activity.activity_type === 'band_joined' && 'Te uniste a una banda'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin actividad</h3>
                <p className="text-muted-foreground">
                  {isCurrentUser 
                    ? "Aún no tienes actividad en la plataforma."
                    : "Este usuario aún no tiene actividad."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Biografía</h4>
                  <p className="text-muted-foreground">{user.bio}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.location && (
                  <div>
                    <h4 className="font-semibold mb-2">Ubicación</h4>
                    <p className="text-muted-foreground">{user.location}</p>
                  </div>
                )}
                
                {user.date_of_birth && (
                  <div>
                    <h4 className="font-semibold mb-2">Fecha de nacimiento</h4>
                    <p className="text-muted-foreground">
                      {new Date(user.date_of_birth).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {user.genres && user.genres.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Géneros musicales</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.genres.map((genre, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Miembro desde</h4>
                  <p className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
