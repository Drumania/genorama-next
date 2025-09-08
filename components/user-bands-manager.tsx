'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Band } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Users, Music } from 'lucide-react'

interface UserBandsManagerProps {
  userId: string
}

export default function UserBandsManager({ userId }: UserBandsManagerProps) {
  const [userBands, setUserBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingBand, setEditingBand] = useState<Band | null>(null)
  const supabase = createClientComponentClient()

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: '',
    genres: [] as string[],
    location: '',
    website_url: '',
    spotify_url: '',
    youtube_url: '',
    instagram_url: ''
  })

  useEffect(() => {
    fetchUserBands()
  }, [userId])

  const fetchUserBands = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('user_bands')
        .select(`
          band_id,
          bands (
            id,
            name,
            username,
            description,
            avatar_url,
            genres,
            location,
            website_url,
            spotify_url,
            youtube_url,
            instagram_url
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error

      const bands = data.map(item => item.bands).filter(Boolean)
      setUserBands(bands)
    } catch (error) {
      console.error('Error fetching user bands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBand = async () => {
    try {
      // Create new band
      const { data: bandData, error: bandError } = await supabase
        .from('bands')
        .insert({
          name: formData.name,
          username: formData.username,
          description: formData.description,
          genres: formData.genres,
          location: formData.location,
          website_url: formData.website_url,
          spotify_url: formData.spotify_url,
          youtube_url: formData.youtube_url,
          instagram_url: formData.instagram_url
        })
        .select()
        .single()

      if (bandError) throw bandError

      // Create user-band relationship
      const { error: relationError } = await supabase
        .from('user_bands')
        .insert({
          user_id: userId,
          band_id: bandData.id,
          role: 'owner',
          is_active: true
        })

      if (relationError) throw relationError

      // Reset form and close dialog
      setFormData({
        name: '',
        username: '',
        description: '',
        genres: [],
        location: '',
        website_url: '',
        spotify_url: '',
        youtube_url: '',
        instagram_url: ''
      })
      setShowCreateDialog(false)
      
      // Refresh bands list
      await fetchUserBands()
      
      alert('Banda creada exitosamente!')
    } catch (error) {
      console.error('Error creating band:', error)
      alert('Error al crear la banda')
    }
  }

  const handleUpdateBand = async () => {
    if (!editingBand) return
    
    try {
      const { error } = await supabase
        .from('bands')
        .update({
          name: formData.name,
          username: formData.username,
          description: formData.description,
          genres: formData.genres,
          location: formData.location,
          website_url: formData.website_url,
          spotify_url: formData.spotify_url,
          youtube_url: formData.youtube_url,
          instagram_url: formData.instagram_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBand.id)

      if (error) throw error

      // Reset form and close dialog
      setFormData({
        name: '',
        username: '',
        description: '',
        genres: [],
        location: '',
        website_url: '',
        spotify_url: '',
        youtube_url: '',
        instagram_url: ''
      })
      setEditingBand(null)
      
      // Refresh bands list
      await fetchUserBands()
      
      alert('Banda actualizada exitosamente!')
    } catch (error) {
      console.error('Error updating band:', error)
      alert('Error al actualizar la banda')
    }
  }

  const handleDeleteBand = async (bandId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta banda?')) return
    
    try {
      // Deactivate user-band relationship
      const { error } = await supabase
        .from('user_bands')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('band_id', bandId)

      if (error) throw error

      // Refresh bands list
      await fetchUserBands()
      
      alert('Banda eliminada exitosamente!')
    } catch (error) {
      console.error('Error deleting band:', error)
      alert('Error al eliminar la banda')
    }
  }

  const openEditDialog = (band: Band) => {
    setEditingBand(band)
    setFormData({
      name: band.name || '',
      username: band.username || '',
      description: band.description || '',
      genres: band.genres || [],
      location: band.location || '',
      website_url: band.website_url || '',
      spotify_url: band.spotify_url || '',
      youtube_url: band.youtube_url || '',
      instagram_url: band.instagram_url || ''
    })
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
      <Card>
        <CardHeader>
          <CardTitle>Mis Bandas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Mis Bandas
        </CardTitle>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Banda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Banda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="band-name">Nombre de la Banda</Label>
                  <Input
                    id="band-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre de la banda"
                  />
                </div>
                <div>
                  <Label htmlFor="band-username">Username</Label>
                  <Input
                    id="band-username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="@username"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="band-description">Descripción</Label>
                <Textarea
                  id="band-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción de la banda..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="band-location">Ubicación</Label>
                  <Input
                    id="band-location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ciudad, País"
                  />
                </div>
                <div>
                  <Label htmlFor="band-website">Sitio Web</Label>
                  <Input
                    id="band-website"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="band-spotify">Spotify</Label>
                  <Input
                    id="band-spotify"
                    value={formData.spotify_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, spotify_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="band-youtube">YouTube</Label>
                  <Input
                    id="band-youtube"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="band-instagram">Instagram</Label>
                  <Input
                    id="band-instagram"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                    placeholder="https://..."
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

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateBand}>
                  Crear Banda
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {userBands.length > 0 ? (
          <div className="space-y-4">
            {userBands.map((band) => (
              <div key={band.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={band.avatar_url || undefined} />
                  <AvatarFallback className="bg-gray-800 text-white">
                    {band.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{band.name}</h3>
                  <p className="text-sm text-gray-600">@{band.username}</p>
                  {band.description && (
                    <p className="text-sm text-gray-500 mt-1">{band.description}</p>
                  )}
                  {band.genres && band.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {band.genres.map((genre, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(band)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Editar Banda: {band.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Same form fields as create, but with update handler */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-band-name">Nombre de la Banda</Label>
                            <Input
                              id="edit-band-name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Nombre de la banda"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-band-username">Username</Label>
                            <Input
                              id="edit-band-username"
                              value={formData.username}
                              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                              placeholder="@username"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-band-description">Descripción</Label>
                          <Textarea
                            id="edit-band-description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descripción de la banda..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-band-location">Ubicación</Label>
                            <Input
                              id="edit-band-location"
                              value={formData.location}
                              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Ciudad, País"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-band-website">Sitio Web</Label>
                            <Input
                              id="edit-band-website"
                              value={formData.website_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="edit-band-spotify">Spotify</Label>
                            <Input
                              id="edit-band-spotify"
                              value={formData.spotify_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, spotify_url: e.target.value }))}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-band-youtube">YouTube</Label>
                            <Input
                              id="edit-band-youtube"
                              value={formData.youtube_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-band-instagram">Instagram</Label>
                            <Input
                              id="edit-band-instagram"
                              value={formData.instagram_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                              placeholder="https://..."
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

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingBand(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleUpdateBand}>
                            Actualizar Banda
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteBand(band.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No tienes bandas registradas</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear nueva banda
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
