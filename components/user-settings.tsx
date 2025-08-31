"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Bell, Music, Palette, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfileSettings } from "./profile-settings"
import { BandSettings } from "./band-settings"
import { SecuritySettings } from "./security-settings"
import { NotificationSettings } from "./notification-settings"

export function UserSettings() {
  const [activeTab, setActiveTab] = useState("perfil")

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">Gestiona tu cuenta y preferencias</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="bandas" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Bandas
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="apariencia" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="perfil" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        {/* Bands Tab */}
        <TabsContent value="bandas" className="space-y-6">
          <BandSettings />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="seguridad" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notificaciones" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="apariencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Tema</h3>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Claro
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Oscuro
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Sistema
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Densidad</h3>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Compacta
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Normal
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Espaciosa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
