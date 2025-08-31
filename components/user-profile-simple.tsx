"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Edit, Users, Calendar, MessageSquare, Heart, Gift, Trophy, Flame } from "lucide-react"

interface UserProfileSimpleProps {
  username: string
}

// Mock data - esto se reemplazará con datos reales de la base de datos
const mockUser = {
  username: "martinbrumana",
  displayName: "martin brumana",
  title: "Web dev",
  userId: "5071444",
  followers: 16,
  following: 1,
  points: 11,
  streak: 6,
  bio: "I'm a Front-End Developer / Product Designer with 15+ years of experience. My career was forged in front-end development at advertising agencies, where I mastered REACT, HTML, CSS, WordPress, jQuery, PHP, MySQL, and UX design. What truly defines me is my ongoing learning and adaptability to new technologies, including the integration of artificial intelligence into my projects. This blend of creativity and technical skill lets me craft products that deliver real value and meet today's market challenges.",
  avatarUrl: "/placeholder-user.jpg",
  level: "Rookie",
  links: [
    { name: "Portfolio", url: "https://martinbrumana.com" },
    { name: "GitHub", url: "https://github.com/martinbrumana" },
    { name: "LinkedIn", url: "https://linkedin.com/in/martinbrumana" }
  ]
}

export function UserProfileSimple({ username }: UserProfileSimpleProps) {
  const [activeTab, setActiveTab] = useState("informacion")
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-card rounded-xl p-6 mb-6 border">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 w-48 bg-muted rounded"></div>
                <div className="h-6 w-32 bg-muted rounded"></div>
                <div className="h-4 w-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
          <div className="border-b mb-6">
            <div className="flex space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <div className="h-6 w-32 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "informacion", label: "Información", icon: Users },
    { id: "eventos", label: "Eventos", icon: Calendar },
    { id: "comunidad", label: "Comunidad", icon: MessageSquare },
    { id: "fan", label: "Fan", icon: Heart },
    { id: "donaciones", label: "Donaciones", icon: Gift }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "informacion":
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-muted-foreground leading-relaxed">{mockUser.bio}</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">Nivel de Usuario</h3>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {mockUser.level}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Continúa participando para subir de nivel
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-4">Enlaces</h3>
              <div className="space-y-3">
                {mockUser.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-medium">{link.name}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{link.url}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )
      
      case "eventos":
        return (
          <div className="bg-card rounded-lg p-6 border text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay eventos</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has creado ningún evento
            </p>
            <Button>Crear mi primer evento</Button>
          </div>
        )
      
      case "comunidad":
        return (
          <div className="bg-card rounded-lg p-6 border text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay posts</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has creado ningún post en la comunidad
            </p>
            <Button>Crear mi primer post</Button>
          </div>
        )
      
      case "fan":
        return (
          <div className="bg-card rounded-lg p-6 border text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sigues a nadie</h3>
            <p className="text-muted-foreground mb-4">
              Descubre y sigue a artistas que te gusten
            </p>
            <Button>Explorar artistas</Button>
          </div>
        )
      
      case "donaciones":
        return (
          <div className="bg-card rounded-lg p-6 border text-center">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay donaciones</h3>
            <p className="text-muted-foreground mb-4">
              Aún no has realizado ninguna donación
            </p>
            <Button>Explorar artistas para donar</Button>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-card rounded-xl p-6 mb-6 border">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center relative">
              <div className="w-8 h-1 bg-white rounded-full"></div>
              <div className="absolute top-2 left-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{mockUser.displayName}</h1>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                FocusPit
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-lg text-muted-foreground mb-1">{mockUser.title}</p>
            <p className="text-sm text-muted-foreground mb-3">#{mockUser.userId}</p>
            
            <div className="flex items-center gap-6 mb-4">
              <span className="text-sm text-muted-foreground">
                {mockUser.followers} followers
              </span>
              <span className="text-sm text-muted-foreground">
                {mockUser.following} following
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">{mockUser.points} points</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">{mockUser.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button className="flex items-center gap-2" asChild>
            <Link href="/configuracion">
              <Edit className="h-4 w-4" />
              Editar Perfil
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  )
}
