"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ArrowUpRight, ArrowDownLeft, User, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Donation } from "@/lib/types"

interface DonationWithProfiles extends Donation {
  donor_profile?: {
    username: string
    display_name: string
    avatar_url: string | null
  } | null
  recipient_profile?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export default function DonacionesPage() {
  const [user, setUser] = useState<any>(null)
  const [donationsGiven, setDonationsGiven] = useState<DonationWithProfiles[]>([])
  const [donationsReceived, setDonationsReceived] = useState<DonationWithProfiles[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGiven: 0,
    totalReceived: 0,
    countGiven: 0,
    countReceived: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)

        // Fetch donations given by user
        const { data: givenData, error: givenError } = await supabase
          .from("donations")
          .select(`
            *,
            recipient_profile:recipient_id (
              username,
              display_name,
              avatar_url
            )
          `)
          .eq("donor_id", currentUser.id)
          .eq("payment_status", "completed")
          .order("created_at", { ascending: false })

        if (givenError) throw givenError

        // Fetch donations received by user
        const { data: receivedData, error: receivedError } = await supabase
          .from("donations")
          .select(`
            *,
            donor_profile:donor_id (
              username,
              display_name,
              avatar_url
            )
          `)
          .eq("recipient_id", currentUser.id)
          .eq("payment_status", "completed")
          .order("created_at", { ascending: false })

        if (receivedError) throw receivedError

        setDonationsGiven(givenData || [])
        setDonationsReceived(receivedData || [])

        // Calculate stats
        const totalGiven = (givenData || []).reduce((sum, d) => sum + d.amount, 0)
        const totalReceived = (receivedData || []).reduce((sum, d) => sum + d.amount, 0)

        setStats({
          totalGiven,
          totalReceived,
          countGiven: givenData?.length || 0,
          countReceived: receivedData?.length || 0,
        })
      } catch (error) {
        console.error("Error fetching donations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Historial de Donaciones</h1>
          <p className="text-lg text-muted-foreground">Revisa todas tus donaciones realizadas y recibidas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Donado</p>
                  <p className="text-2xl font-bold">${stats.totalGiven}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <ArrowDownLeft className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recibido</p>
                  <p className="text-2xl font-bold">${stats.totalReceived}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Heart className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Donaciones Hechas</p>
                  <p className="text-2xl font-bold">{stats.countGiven}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Heart className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Donaciones Recibidas</p>
                  <p className="text-2xl font-bold">{stats.countReceived}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations Tabs */}
        <Tabs defaultValue="given" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="given" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Donaciones Realizadas ({stats.countGiven})
            </TabsTrigger>
            <TabsTrigger value="received" className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Donaciones Recibidas ({stats.countReceived})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="given" className="mt-6">
            {donationsGiven.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Aún no has realizado donaciones</p>
                  <p className="text-sm text-muted-foreground mt-2">¡Apoya a tus artistas favoritos!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/bandas">Explorar Artistas</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {donationsGiven.map((donation) => (
                  <Card key={donation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={donation.recipient_profile?.avatar_url || ""} />
                            <AvatarFallback>
                              {donation.recipient_profile?.display_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">Donación a {donation.recipient_profile?.display_name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {donation.is_anonymous ? "Anónima" : "Pública"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              @{donation.recipient_profile?.username}
                            </p>
                            {donation.message && (
                              <p className="text-sm bg-muted/50 p-3 rounded-lg mb-2">"{donation.message}"</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(donation.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${donation.amount}</p>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/banda/${donation.recipient_profile?.username}`}>Ver Perfil</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-6">
            {donationsReceived.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Aún no has recibido donaciones</p>
                  <p className="text-sm text-muted-foreground mt-2">¡Comparte tu música para recibir apoyo!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/submit">Subir Música</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {donationsReceived.map((donation) => (
                  <Card key={donation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            {donation.is_anonymous ? (
                              <AvatarFallback>
                                <User className="h-6 w-6" />
                              </AvatarFallback>
                            ) : (
                              <>
                                <AvatarImage src={donation.donor_profile?.avatar_url || ""} />
                                <AvatarFallback>
                                  {donation.donor_profile?.display_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                Donación de{" "}
                                {donation.is_anonymous ? "Donador anónimo" : donation.donor_profile?.display_name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {donation.is_anonymous ? "Anónima" : "Pública"}
                              </Badge>
                            </div>
                            {!donation.is_anonymous && (
                              <p className="text-sm text-muted-foreground mb-2">@{donation.donor_profile?.username}</p>
                            )}
                            {donation.message && (
                              <p className="text-sm bg-muted/50 p-3 rounded-lg mb-2">"{donation.message}"</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(donation.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-500">${donation.amount}</p>
                          {!donation.is_anonymous && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/banda/${donation.donor_profile?.username}`}>Ver Perfil</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
