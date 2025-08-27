"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, ExternalLink, Clock } from "lucide-react"
import { toggleEventAttendance } from "@/lib/supabase/actions"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const [attendeeCount, setAttendeeCount] = useState(event.attendee_count)
  const [userAttending, setUserAttending] = useState(!!event.user_attending)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleAttendance = () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    startTransition(async () => {
      const result = await toggleEventAttendance(event.id)

      if (result.error) {
        console.error("Attendance error:", result.error)
        return
      }

      if (result.success) {
        if (result.action === "added") {
          setAttendeeCount((prev) => prev + 1)
          setUserAttending(true)
        } else {
          setAttendeeCount((prev) => prev - 1)
          setUserAttending(false)
        }
      }
    })
  }

  const eventDate = new Date(event.event_date)
  const isUpcoming = eventDate > new Date()
  const primaryGenre = event.genres?.[0] || "Evento"

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={event.cover_image_url || "/placeholder.svg?height=200&width=400&query=music event concert"}
            alt={event.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={isUpcoming ? "default" : "secondary"} className="bg-primary/90">
              {isUpcoming ? "Próximo" : "Pasado"}
            </Badge>
          </div>
          {event.is_online && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-background/80">
                Online
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={event.organizer?.avatar_url || ""} />
                <AvatarFallback className="text-xs">{event.organizer?.display_name?.charAt(0) || "O"}</AvatarFallback>
              </Avatar>
              <span>por {event.organizer?.display_name || "Organizador"}</span>
            </div>
          </div>
          <Badge variant="outline">{primaryGenre}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{eventDate.toLocaleDateString()}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          {(event.city || event.location) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {event.venue_name && `${event.venue_name}, `}
                {event.city}
                {event.country && `, ${event.country}`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {attendeeCount} asistentes
              {event.max_attendees && ` / ${event.max_attendees} máximo`}
            </span>
          </div>
        </div>

        {event.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>}

        <div className="flex items-center justify-between">
          <Button
            variant={userAttending ? "default" : "outline"}
            size="sm"
            onClick={handleAttendance}
            disabled={isPending || (!isUpcoming && !userAttending)}
            className={userAttending ? "bg-primary" : "bg-transparent"}
          >
            {userAttending ? "Asistiré" : "Asistir"}
          </Button>

          <div className="flex items-center gap-2">
            {event.ticket_url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/eventos/${event.id}`}>Ver detalles</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
