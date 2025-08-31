"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, Smartphone, MessageSquare, Heart, Gift, Calendar, Users, Music } from "lucide-react"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const notificationTypes = [
    {
      id: "new_releases",
      title: "Nuevos Lanzamientos",
      description: "Cuando artistas que sigues publican nueva música",
      icon: Music,
      email: true,
      push: true,
      sms: false
    },
    {
      id: "event_updates",
      title: "Actualizaciones de Eventos",
      description: "Cambios en eventos a los que te has registrado",
      icon: Calendar,
      email: true,
      push: true,
      sms: false
    },
    {
      id: "community_posts",
      title: "Posts de la Comunidad",
      description: "Nuevos posts en categorías que sigues",
      icon: MessageSquare,
      email: false,
      push: true,
      sms: false
    },
    {
      id: "followers",
      title: "Nuevos Seguidores",
      description: "Cuando alguien comienza a seguirte",
      icon: Users,
      email: true,
      push: true,
      sms: false
    },
    {
      id: "likes_comments",
      title: "Me Gusta y Comentarios",
      description: "Actividad en tu contenido y comentarios",
      icon: Heart,
      email: false,
      push: true,
      sms: false
    },
    {
      id: "donations",
      title: "Donaciones",
      description: "Notificaciones sobre donaciones recibidas",
      icon: Gift,
      email: true,
      push: true,
      sms: true
    }
  ]

  const [notifications, setNotifications] = useState(notificationTypes)

  const updateNotification = (id: string, channel: string, enabled: boolean) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, [channel]: enabled }
          : notif
      )
    )
  }

  const toggleAll = (channel: string, enabled: boolean) => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, [channel]: enabled }))
    )
    
    // Update the main channel state
    if (channel === 'email') setEmailNotifications(enabled)
    if (channel === 'push') setPushNotifications(enabled)
    if (channel === 'sms') setSmsNotifications(enabled)
  }

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Canales de Notificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-medium">Notificaciones por Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones importantes por correo electrónico
                  </p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={(enabled) => {
                  setEmailNotifications(enabled)
                  toggleAll('email', enabled)
                }}
              />
            </div>
            
            {emailNotifications && (
              <div className="ml-8">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Configurar Email
                </Button>
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-green-500" />
                <div>
                  <h3 className="font-medium">Notificaciones Push</h3>
                  <p className="text-sm text-muted-foreground">
                    Alertas en tiempo real en tu navegador
                  </p>
                </div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={(enabled) => {
                  setPushNotifications(enabled)
                  toggleAll('push', enabled)
                }}
              />
            </div>
            
            {pushNotifications && (
              <div className="ml-8">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configurar Push
                </Button>
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-purple-500" />
                <div>
                  <h3 className="font-medium">Notificaciones por SMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Alertas críticas por mensaje de texto
                  </p>
                </div>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={(enabled) => {
                  setSmsNotifications(enabled)
                  toggleAll('sms', enabled)
                }}
              />
            </div>
            
            {smsNotifications && (
              <div className="ml-8">
                <Button variant="outline" size="sm">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Agregar Número
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificación</CardTitle>
          <p className="text-sm text-muted-foreground">
            Personaliza qué notificaciones recibir en cada canal
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => {
            const Icon = notification.icon
            return (
              <div key={notification.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.email}
                          onCheckedChange={(enabled) => 
                            updateNotification(notification.id, 'email', enabled)
                          }
                          disabled={!emailNotifications}
                        />
                        <span className="text-xs text-muted-foreground">Email</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.push}
                          onCheckedChange={(enabled) => 
                            updateNotification(notification.id, 'push', enabled)
                          }
                          disabled={!pushNotifications}
                        />
                        <span className="text-xs text-muted-foreground">Push</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notification.sms}
                          onCheckedChange={(enabled) => 
                            updateNotification(notification.id, 'sms', enabled)
                          }
                          disabled={!smsNotifications}
                        />
                        <span className="text-xs text-muted-foreground">SMS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Horas Silenciosas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configura cuándo no quieres recibir notificaciones
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Activar Horas Silenciosas</h3>
              <p className="text-sm text-muted-foreground">
                No recibirás notificaciones durante el horario configurado
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Desde</label>
              <input
                type="time"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                defaultValue="22:00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hasta</label>
              <input
                type="time"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                defaultValue="08:00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Restaurar Predeterminados
        </Button>
        <Button>
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
