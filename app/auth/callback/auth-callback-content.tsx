'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle, Music } from 'lucide-react'

export default function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading')
        setMessage('Procesando autenticación...')

        // Obtener el código de autorización de la URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          throw new Error(errorDescription || error)
        }

        if (!code) {
          throw new Error('No se recibió código de autorización')
        }

        // Intercambiar el código por una sesión
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          throw exchangeError
        }

        if (!data.user) {
          throw new Error('No se pudo obtener información del usuario')
        }

        setMessage('Usuario autenticado, creando perfil...')

        // Crear o actualizar el perfil del usuario en nuestra base de datos
        const profileError = await createOrUpdateUserProfile(data.user)
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
          // No lanzamos error aquí porque el usuario ya está autenticado
        }

        setStatus('success')
        setMessage('¡Autenticación exitosa! Redirigiendo...')

        // Redirigir al usuario a la página principal con más tiempo
        setTimeout(() => {
          router.push('/')
        }, 3000)

      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Error durante la autenticación')
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/auth')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [searchParams, router, supabase.auth])

  const createOrUpdateUserProfile = async (user: any) => {
    try {
      // Extraer información del usuario de Google
      const email = user.email
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Usuario'
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
      
      // Crear username basado en el nombre (sin espacios, en minúsculas)
      const username = fullName
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20) // Limitar a 20 caracteres

      // Verificar si el username ya existe y hacerlo único
      let finalUsername = username
      let counter = 1
      
      while (true) {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('username', finalUsername)
          .single()

        if (checkError && checkError.code === 'PGRST116') {
          // No se encontró usuario, username disponible
          break
        }
        
        if (existingUser && existingUser.id !== user.id) {
          // Username ya existe para otro usuario
          finalUsername = `${username}${counter}`
          counter++
        } else {
          // Username disponible o es el mismo usuario
          break
        }
      }

      console.log('📝 Creando/actualizando perfil para:', finalUsername)

      // Crear o actualizar el usuario en nuestra tabla users
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          username: finalUsername,
          display_name: fullName,
          email: email,
          avatar_url: avatarUrl,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (upsertError) {
        console.error('Error upserting user:', upsertError)
        return upsertError
      }

      // Esperar un momento para asegurar que la transacción se complete
      await new Promise(resolve => setTimeout(resolve, 500))

      // Verificar que el usuario se creó correctamente
      const { data: verifyUser, error: verifyError } = await supabase
        .from('users')
        .select('username, display_name')
        .eq('id', user.id)
        .single()

      if (verifyError) {
        console.error('Error verificando usuario creado:', verifyError)
        return verifyError
      }

      console.log('✅ Usuario verificado en base de datos:', verifyUser)

      // Crear preferencias por defecto (opcional, no crítico)
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            email_notifications: true,
            push_notifications: true,
            privacy_level: 'public',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
      } catch (prefError) {
        console.warn('⚠️ No se pudieron crear preferencias por defecto:', prefError)
        // No es crítico, continuamos
      }

      console.log('🎉 User profile created/updated successfully:', finalUsername)
      return null

    } catch (error) {
      console.error('💥 Error in createOrUpdateUserProfile:', error)
      return error
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Music className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Genorama</h1>
        </div>

        {/* Card de estado */}
        <Card className="shadow-xl border border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-foreground">
              {status === 'loading' && 'Procesando...'}
              {status === 'success' && '¡Éxito!'}
              {status === 'error' && 'Error'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            {/* Icono de estado */}
            <div className="flex justify-center">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>

            {/* Mensaje */}
            <p className="text-foreground">{message}</p>

            {/* Información adicional */}
            {status === 'loading' && (
              <p className="text-sm text-muted-foreground">
                Esto puede tomar unos segundos...
              </p>
            )}

            {status === 'success' && (
              <p className="text-sm text-green-600">
                Tu perfil ha sido creado automáticamente
              </p>
            )}

            {status === 'error' && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">
                  Algo salió mal durante la autenticación
                </p>
                <p className="text-xs text-muted-foreground">
                  Serás redirigido al login en unos segundos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
