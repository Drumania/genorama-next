'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Band } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UserStatsCard from '@/components/user-stats-card'
import UserBandsManager from '@/components/user-bands-manager'

export default function UserSettingsPage() {
  const params = useParams()
  const username = params.username as string
  const supabase = createClient()
  
  const [user, setUser] = useState<User | null>(null)
  const [userBands, setUserBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Form states
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location: '',
    date_of_birth: '',
    genres: [] as string[],
    email: ''
  })

  useEffect(() => {
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (userError) throw userError

      setUser(userData)
      setFormData({
        display_name: userData.display_name || '',
        bio: userData.bio || '',
        location: userData.location || '',
        date_of_birth: userData.date_of_birth || '',
        genres: userData.genres || [],
        email: userData.email || ''
      })

      // Fetch user's bands
      const { data: bandsData, error: bandsError } = await supabase
        .from('user_bands')
        .select(`
          band_id,
          bands (
            id,
            name,
            username,
            avatar_url,
            description
          )
        `)
        .eq('user_id', userData.id)
        .eq('is_active', true)

      if (bandsError) throw bandsError

      const bands = bandsData.map(item => item.bands).filter(Boolean)
      setUserBands(bands)

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('users')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          location: formData.location,
          date_of_birth: formData.date_of_birth,
          genres: formData.genres,
          email: formData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      setUser(prev => prev ? { ...prev, ...formData } : null)
      
      alert('Perfil actualizado correctamente!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const addGenre = (genre: string) => {
    if (genre && !formData.genres.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genre]
      }))
    }
  }

  const removeGenre = (genreToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove)
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Usuario no encontrado</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-2xl font-bold bg-gray-800 text-white">
                  {user.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.display_name}</h1>
                
                {/* Bands Dropdown (FocusPit equivalent) */}
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-auto">
                      <span className="text-sm font-medium">
                        {userBands.length > 0 ? userBands[0]?.name : 'Sin bandas'}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {userBands.map((band) => (
                        <SelectItem key={band.id} value={band.id}>
                          {band.name}
                        </SelectItem>
                      ))}
                      {userBands.length === 0 && (
                        <SelectItem value="no-bands" disabled>
                          No tienes bandas
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-gray-600 mb-2">Web Developer</p>
              <p className="text-gray-500 text-sm mb-4">#{user.id.slice(0, 8)}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>0 seguidores</span>
                <span>0 siguiendo</span>
                <span>0 puntos</span>
                <span>0 días streak</span>
              </div>
              
              {/* User Stats Card */}
              <div className="mt-4">
                <UserStatsCard userId={user.id} />
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('profile')}
              className="ml-auto"
            >
              Editar mi perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="bands">Bandas</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_name">Nombre de pantalla</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Tu nombre de pantalla"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ciudad, País"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Fecha de nacimiento</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Géneros musicales</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Agregar género..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const target = e.target as HTMLInputElement
                        addGenre(target.value)
                        target.value = ''
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Agregar género..."]') as HTMLInputElement
                      if (input && input.value) {
                        addGenre(input.value)
                        input.value = ''
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeGenre(genre)}>
                      {genre} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bands Tab */}
        <TabsContent value="bands">
          <UserBandsManager userId={user.id} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>No hay actividad reciente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Configuración de preferencias</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Configuración de seguridad</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Configuración de notificaciones</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
