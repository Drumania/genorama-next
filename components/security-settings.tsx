"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Lock, Smartphone, Monitor, AlertTriangle, CheckCircle } from "lucide-react"

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const activeSessions = [
    {
      id: 1,
      device: "Chrome en Windows",
      location: "Buenos Aires, Argentina",
      lastActive: "Hace 2 horas",
      current: true
    },
    {
      id: 2,
      device: "Safari en iPhone",
      location: "Buenos Aires, Argentina",
      lastActive: "Hace 1 día",
      current: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Cambiar Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Ingresa tu contraseña actual"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite la nueva contraseña"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button>
              <Lock className="h-4 w-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Autenticación de Dos Factores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Verificación por SMS</h3>
              <p className="text-sm text-muted-foreground">
                Recibe códigos de verificación por mensaje de texto
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Autenticación de dos factores activada</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tu cuenta está protegida con verificación adicional
              </p>
              <Button variant="outline" size="sm">
                Configurar Métodos
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline">
              <Smartphone className="h-4 w-4 mr-2" />
              Configurar 2FA
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Códigos de Respaldo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notificaciones por Email</h3>
              <p className="text-sm text-muted-foreground">
                Recibe alertas cuando se inicie sesión en tu cuenta
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Alertas de Inicio de Sesión</h3>
              <p className="text-sm text-muted-foreground">
                Notificaciones para inicios de sesión desde nuevos dispositivos
              </p>
            </div>
            <Switch
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Sesiones Activas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <Badge variant="secondary">Actual</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.location} • {session.lastActive}
                    </div>
                  </div>
                </div>
                
                {!session.current && (
                  <Button variant="outline" size="sm" className="text-destructive">
                    Cerrar Sesión
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline">
              <Monitor className="h-4 w-4 mr-2" />
              Ver Todas las Sesiones
            </Button>
            <Button variant="outline" className="text-destructive">
              Cerrar Todas las Sesiones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Recovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recuperación de Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configura métodos de recuperación para acceder a tu cuenta en caso de emergencia
          </p>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Smartphone className="h-4 w-4 mr-2" />
              Agregar Teléfono
            </Button>
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Códigos de Respaldo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
