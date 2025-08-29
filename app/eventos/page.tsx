"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EventCard } from "@/components/event-card"
import { CreateEventModal } from "@/components/create-event-modal"
import { Calendar, Plus, Search, MapPin } from "lucide-react"
import { getEvents, getEventsWithUserAttendance } from "@/lib/supabase/queries.client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Event } from "@/lib/types"

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [showUpcoming, setShowUpcoming] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)

        // Fetch events
        const eventsData = user
          ? await getEventsWithUserAttendance(user.id, 50, undefined, showUpcoming)
          : await getEvents(50, undefined, showUpcoming)

        setEvents(eventsData)
        setFilteredEvents(eventsData)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [showUpcoming])

  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (cityFilter) {
      filtered = filtered.filter((event) => event.city?.toLowerCase().includes(cityFilter.toLowerCase()))
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, cityFilter])

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      router.push("/auth/signup?tab=login")
      return
    }
    setIsCreateModalOpen(true)
  }

  const upcomingEvents = filteredEvents.filter((event) => new Date(event.event_date) > new Date())
  const pastEvents = filteredEvents.filter((event) => new Date(event.event_date) <= new Date())

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1200px] mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Eventos Musicales</h1>
            <p className="text-lg text-muted-foreground">Descubre conciertos y eventos cerca de ti</p>
          </div>
          <Button onClick={handleCreateEvent} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Crear Evento
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos, artistas..."
              className="pl-10 bg-background border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ciudad"
              className="pl-10 bg-background border-border/50 w-full sm:w-48"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showUpcoming ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUpcoming(true)}
              className={showUpcoming ? "bg-primary" : "bg-transparent"}
            >
              Próximos
            </Button>
            <Button
              variant={!showUpcoming ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUpcoming(false)}
              className={!showUpcoming ? "bg-primary" : "bg-transparent"}
            >
              Pasados
            </Button>
          </div>
        </div>

        {/* Events */}
        <div className="space-y-8">
          {showUpcoming && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Próximos Eventos</h2>
                <span className="text-muted-foreground">({upcomingEvents.length})</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {searchTerm || cityFilter
                      ? "No se encontraron eventos con esos filtros"
                      : "No hay eventos próximos"}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    {searchTerm || cityFilter
                      ? "Intenta con otros términos de búsqueda"
                      : "¡Sé el primero en crear uno!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          )}

          {!showUpcoming && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Eventos Pasados</h2>
                <span className="text-muted-foreground">({pastEvents.length})</span>
              </div>

              {pastEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No hay eventos pasados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <CreateEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
