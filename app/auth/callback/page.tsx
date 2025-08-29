"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const url = localStorage.getItem("postAuthRedirect")
        localStorage.removeItem("postAuthRedirect")
        if (url) {
          // If the stored URL points to an auth page, ignore it
          // and send the user to home to avoid bouncing back to login/signup.
          try {
            const parsed = new URL(url)
            const path = parsed.pathname
            const isAuthRoute = path === "/login" || path.startsWith("/auth")
            if (isAuthRoute) {
              router.replace("/")
              return
            }
          } catch {}

          // Use replace to avoid keeping the callback page in history
          router.replace(url)
          return
        }
      } catch {}
      router.replace("/")
    }, 50)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Finalizando autenticación...</p>
      </div>
    </div>
  )
}
