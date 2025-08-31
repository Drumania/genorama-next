"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Plus, Edit, Trash2, Users, Crown, Shield, User } from "lucide-react"

export function BandSettings() {
  const [bands] = useState([
    {
      id: 1,
      name: "Los Rockeros del Sur",
      username: "rockeros_sur",
      description: "Banda de rock alternativo con influencias latinas",
      role: "owner",
      members: 4,
      coverImage: "/alternative-rock-band-album-cover-ethereal.png"
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newBand, setNewBand] = useState({
    name: "",
    username: "",
    description: "",
    genres: []
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "member":
        return <Users className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Propietario"
      case "admin":
        return "Administrador"
      case "member":
        return "Miembro"
      default:
        return "Colaborador"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mis Bandas</h2>
          <p className="text-muted-foreground">Gestiona tus bandas y proyectos musicales</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Banda
        </Button>
      </div>

      {/* Create New Band Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Banda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bandName">Nombre de la Banda</Label>
                <Input
                  id="bandName"
                  value={newBand.name}
                  onChange={(e) => setNewBand({ ...newBand, name: e.target.value })}
                  placeholder="ej: Los Rockeros del Sur"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bandUsername">Nombre de Usuario</Label>
                <Input
                  id="bandUsername"
                  value={newBand.username}
                  onChange={(e) => setNewBand({ ...newBand, username: e.target.value })}
                  placeholder="ej: rockeros_sur"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bandDescription">Descripción</Label>
              <Textarea
                id="bandDescription"
                value={newBand.description}
                onChange={(e) => setNewBand({ ...newBand, description: e.target.value })}
                placeholder="Describe el estilo y la música de tu banda..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Cancelar
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Banda
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Bands */}
      <div className="space-y-4">
        {bands.map((band) => (
          <Card key={band.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Band Cover */}
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img 
                    src={band.coverImage} 
                    alt={band.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Band Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{band.name}</h3>
                    <Badge variant="outline">@{band.username}</Badge>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(band.role)}
                      <span className="text-sm text-muted-foreground">
                        {getRoleLabel(band.role)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{band.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {band.members} miembros
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  {band.role === "owner" && (
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {bands.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes bandas</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primera banda para comenzar a compartir tu música
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi Primera Banda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Band Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Invitaciones Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tienes invitaciones pendientes
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
