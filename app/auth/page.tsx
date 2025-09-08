'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Music, Chrome } from 'lucide-react'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('login')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Verificar si ya está autenticado
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setMessage(null)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      setMessage('Redirigiendo a Google...')
    } catch (error: any) {
      console.error('Error signing in with Google:', error)
      setError(error.message || 'Error al iniciar sesión con Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setMessage('Sesión cerrada correctamente')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error: any) {
      setError(error.message || 'Error al cerrar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Genorama</h1>
          <p className="text-muted-foreground">Tu plataforma musical</p>
        </div>

        {/* Card de autenticación */}
        <Card className="shadow-xl border border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-foreground">
              {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {activeTab === 'login' 
                ? 'Accede a tu cuenta musical' 
                : 'Únete a la comunidad musical'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Tabs para login/registro */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Mensajes de error/éxito */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Botón de Google */}
            <div className="space-y-4">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Chrome className="h-5 w-5 mr-2" />
                )}
                {activeTab === 'login' 
                  ? 'Iniciar sesión con Google' 
                  : 'Crear cuenta con Google'
                }
              </Button>

                          <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Al continuar, aceptas nuestros{' '}
                <a href="#" className="text-primary hover:underline">
                  Términos de Servicio
                </a>{' '}
                y{' '}
                <a href="#" className="text-primary hover:underline">
                  Política de Privacidad
                </a>
              </p>
            </div>
            </div>

            {/* Información adicional */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {activeTab === 'login' 
                  ? '¿No tienes cuenta? ' 
                  : '¿Ya tienes cuenta? '
                }
                <button
                  onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline font-medium"
                >
                  {activeTab === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Genorama es una plataforma para músicos, bandas y amantes de la música
          </p>
        </div>
      </div>
    </div>
  )
}
