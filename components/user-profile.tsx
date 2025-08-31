"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Edit, Users, Calendar, MessageSquare, Heart, Gift, Trophy, Flame } from "lucide-react"
import { UserProfileTabs } from "./user-profile-tabs"

interface UserProfileProps {
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

export function UserProfile({ username }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("informacion")

  const tabs = [
    { id: "informacion", label: "Información", icon: Users },
    { id: "eventos", label: "Eventos", icon: Calendar },
    { id: "comunidad", label: "Comunidad", icon: MessageSquare },
    { id: "fan", label: "Fan", icon: Heart },
    { id: "donaciones", label: "Donaciones", icon: Gift }
  ]

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
      <UserProfileTabs activeTab={activeTab} user={mockUser} />
    </div>
  )
}
