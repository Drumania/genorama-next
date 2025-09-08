import { Suspense } from 'react'
import { Loader2, Music } from 'lucide-react'
import AuthCallbackContent from './auth-callback-content'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
              <div className="min-h-screen bg-background flex items-center justify-center p-4">
              <div className="text-center">
        <Music className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-4">Genorama</h1>
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-foreground">Cargando...</p>
      </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
