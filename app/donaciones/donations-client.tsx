"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ArrowUpRight, ArrowDownLeft, User, Calendar } from "lucide-react"
import Link from "next/link"
import type { Donation } from "@/lib/types"

interface DonationsClientProps {
  initialDonationsGiven: Donation[];
  initialDonationsReceived: Donation[];
}

export function DonationsClient({ initialDonationsGiven, initialDonationsReceived }: DonationsClientProps) {
  const [donationsGiven] = useState<Donation[]>(initialDonationsGiven)
  const [donationsReceived] = useState<Donation[]>(initialDonationsReceived)

  const stats = {
    totalGiven: donationsGiven.reduce((sum, d) => sum + d.amount, 0),
    totalReceived: donationsReceived.reduce((sum, d) => sum + d.amount, 0),
    countGiven: donationsGiven.length,
    countReceived: donationsReceived.length,
  }

  return (
    <div className="container max-w-[1200px] mx-auto py-8">
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
                  <p className="text-2xl font-bold">${stats.totalGiven.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold">${stats.totalReceived.toFixed(2)}</p>
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
              {donationsGiven.map((donation) => {
                const recipient = donation.recipient_user || donation.recipient_band;
                const profileLink = donation.recipient_user ? `/usuario/${recipient?.username}` : `/banda/${recipient?.username}`;
                const displayName = donation.recipient_user ? donation.recipient_user.display_name : (donation.recipient_band as any)?.name;

                return (
                  <Card key={donation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={recipient?.avatar_url || ""} />
                            <AvatarFallback>{displayName?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">Donación a {displayName}</h3>
                              <Badge variant="outline" className="text-xs">
                                {donation.is_anonymous ? "Anónima" : "Pública"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">@{recipient?.username}</p>
                            {donation.message && <p className="text-sm bg-muted/50 p-3 rounded-lg mb-2">"{donation.message}"</p>}
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
                            <Link href={profileLink}>Ver Perfil</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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
                            <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                          ) : (
                            <>
                              <AvatarImage src={donation.donor?.avatar_url || ""} />
                              <AvatarFallback>{donation.donor?.display_name?.charAt(0) || "U"}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              Donación de{" "}
                              {donation.is_anonymous ? "Donador anónimo" : donation.donor?.display_name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {donation.is_anonymous ? "Anónima" : "Pública"}
                            </Badge>
                          </div>
                          {!donation.is_anonymous && <p className="text-sm text-muted-foreground mb-2">@{donation.donor?.username}</p>}
                          {donation.message && <p className="text-sm bg-muted/50 p-3 rounded-lg mb-2">"{donation.message}"</p>}
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
                            <Link href={`/usuario/${donation.donor?.username}`}>Ver Perfil</Link>
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
  )
}
