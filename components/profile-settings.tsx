"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, Plus, X, ExternalLink } from "lucide-react"

export function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "martin brumana",
    username: "martinbrumana",
    title: "Web dev",
    bio: "I'm a Front-End Developer / Product Designer with 15+ years of experience. My career was forged in front-end development at advertising agencies, where I mastered REACT, HTML, CSS, WordPress, jQuery, PHP, MySQL, and UX design. What truly defines me is my ongoing learning and adaptability to new technologies, including the integration of artificial intelligence into my projects. This blend of creativity and technical skill lets me craft products that deliver real value and meet today's market challenges.",
    email: "martin@example.com",
    location: "Buenos Aires, Argentina",
    website: "https://martinbrumana.com"
  })
  const [links, setLinks] = useState([
    { name: "Portfolio", url: "https://martinbrumana.com" },
    { name: "GitHub", url: "https://github.com/martinbrumana" },
    { name: "LinkedIn", url: "https://linkedin.com/in/martinbrumana" }
  ])
  const [newLink, setNewLink] = useState({ name: "", url: "" })

  const handleSave = () => {
    // Aquí se guardarían los cambios en la base de datos
    setIsEditing(false)
    // Mostrar mensaje de éxito
  }

  const addLink = () => {
    if (newLink.name && newLink.url) {
      setLinks([...links, newLink])
      setNewLink({ name: "", url: "" })
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-2xl">MB</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Cambia tu foto de perfil para personalizar tu cuenta
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Cambiar Foto
                </Button>
                <Button size="sm" variant="outline" className="text-destructive">
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre de Pantalla</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título/Profesión</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={!isEditing}
              placeholder="ej: Desarrollador Web, Músico, Productor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                placeholder="Ciudad, País"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={!isEditing}
              placeholder="https://tu-sitio.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Enlaces Personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{link.name}</span>
                    <Badge variant="outline" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {link.url}
                    </Badge>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeLink(index)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nombre del enlace"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addLink}
                className="mt-2"
                disabled={!newLink.name || !newLink.url}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Enlace
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  )
}
