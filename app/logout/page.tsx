"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(3)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Iniciar logout automáticamente
    const performLogout = async () => {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      setIsLoggingOut(false)
    }

    performLogout()

    // Countdown para redirección automática
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, supabase.auth])

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icono de logout */}
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <LogOut className="w-10 h-10 text-primary" />
        </div>

        {/* Mensaje principal */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            ¡Hasta luego!
          </h1>
          <p className="text-lg text-muted-foreground">
            Has cerrado sesión exitosamente
          </p>
        </div>

        {/* Estado del logout */}
        {isLoggingOut ? (
          <div className="space-y-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">Cerrando sesión...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Countdown */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Redirigiendo al inicio en:
              </p>
              <div className="text-2xl font-bold text-primary">
                {countdown}
              </div>
            </div>

            {/* Botón para ir al home inmediatamente */}
            <Button 
              onClick={handleGoHome}
              className="w-full"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al inicio ahora
            </Button>
          </div>
        )}

        {/* Mensaje adicional */}
        <p className="text-xs text-muted-foreground">
          Gracias por usar Genorama. ¡Vuelve pronto!
        </p>
      </div>
    </div>
  )
}
