"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { createEvent } from "@/lib/supabase/actions"
import { useRouter } from "next/navigation"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [venueName, setVenueName] = useState("")
  const [ticketUrl, setTicketUrl] = useState("")
  const [isOnline, setIsOnline] = useState(false)
  const [maxAttendees, setMaxAttendees] = useState("")
  const [genres, setGenres] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !eventDate || !city.trim()) {
      setError("Título, fecha y ciudad son obligatorios")
      return
    }

    const eventDateTime = new Date(eventDate)
    if (eventDateTime <= new Date()) {
      setError("La fecha del evento debe ser en el futuro")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      formData.append("eventDate", eventDate)
      formData.append("endDate", endDate)
      formData.append("location", location.trim())
      formData.append("city", city.trim())
      formData.append("country", country.trim())
      formData.append("venueName", venueName.trim())
      formData.append("ticketUrl", ticketUrl.trim())
      formData.append("isOnline", isOnline.toString())
      formData.append("maxAttendees", maxAttendees)
      formData.append("genres", genres.trim())

      const result = await createEvent(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          // Reset form
          setTitle("")
          setDescription("")
          setEventDate("")
          setEndDate("")
          setLocation("")
          setCity("")
          setCountry("")
          setVenueName("")
          setTicketUrl("")
          setIsOnline(false)
          setMaxAttendees("")
          setGenres("")
          router.push(`/eventos/${result.eventId}`)
        }, 2000)
      }
    })
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¡Evento creado!</h3>
            <p className="text-muted-foreground">Tu evento ha sido publicado exitosamente</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Crear nuevo evento
          </DialogTitle>
          <DialogDescription>Organiza un evento musical y conecta con la comunidad</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título del evento *</Label>
              <Input
                id="title"
                placeholder="Concierto de rock en vivo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
                maxLength={200}
              />
            </div>

            <div>
              <Label htmlFor="eventDate">Fecha y hora *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="endDate">Fecha de finalización</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="Madrid"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                placeholder="España"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="venueName">Nombre del lugar</Label>
              <Input
                id="venueName"
                placeholder="Teatro Principal"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="location">Dirección</Label>
              <Input
                id="location"
                placeholder="Calle Mayor 123"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="maxAttendees">Máximo de asistentes</Label>
              <Input
                id="maxAttendees"
                type="number"
                min="1"
                placeholder="100"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="ticketUrl">URL de entradas</Label>
              <Input
                id="ticketUrl"
                type="url"
                placeholder="https://tickets.example.com"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="genres">Géneros (separados por comas)</Label>
              <Input
                id="genres"
                placeholder="Rock, Pop, Indie"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tu evento, artistas, horarios, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 min-h-24"
                maxLength={1000}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOnline"
                  checked={isOnline}
                  onCheckedChange={(checked) => setIsOnline(checked as boolean)}
                />
                <Label htmlFor="isOnline" className="text-sm">
                  Este es un evento online
                </Label>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Creando..." : "Crear Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
