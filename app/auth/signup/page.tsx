"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "login" ? "login" : "signup"
  const [tab, setTab] = useState(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
            // All users are standard accounts; bands relate separately.
            is_band: false,
          },
        },
      })
      if (error) throw error
      router.push("/auth/verify-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoginLoading(true)
    setLoginError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })
      if (error) throw error
      router.push("/")
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : "Ocurrió un error")
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    const supabase = createClient()
    setIsLoginLoading(true)
    try {
      // Save current location to restore after auth
      try {
        localStorage.setItem("postAuthRedirect", window.location.href)
      } catch {}
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) throw error
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Ocurrió un error")
      setIsLoginLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Bienvenido a Genorama</CardTitle>
            <CardDescription className="text-muted-foreground">
              Crea una cuenta o inicia sesión para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="signup">Registrarse</TabsTrigger>
                  <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="signup">
                {/* Google first */}
                <div className="space-y-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center gap-2 bg-background border border-border cursor-pointer hover:bg-accent/40 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-shadow"
                    onClick={handleGoogleAuth}
                    disabled={isLoginLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.889 32.657 29.355 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.151 7.961 3.039l5.657-5.657C34.869 6.053 29.706 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.151 7.961 3.039l5.657-5.657C34.869 6.053 29.706 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 44c5.304 0 10.152-2.034 13.77-5.343l-6.35-5.371C29.346 34.551 26.773 35.5 24 35.5 18.664 35.5 14.148 32.2 12.41 27.5l-6.51 5.019C8.202 39.494 15.56 44 24 44z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.083 3.157-3.41 5.63-6.583 6.972.003-.001.006-.003.009-.004l6.35 5.371C37.88 37.994 44 32.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                    </svg>
                    {isLoginLoading ? "Redirigiendo a Google..." : "Continuar con Google"}
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-full bg-border/50" />
                    <span className="text-xs text-muted-foreground">o</span>
                    <div className="h-[1px] w-full bg-border/50" />
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="artista@ejemplo.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="tu_usuario"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nombre</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Tu nombre"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  {/* Removed band selection: users are standard; bands link separately to users. */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Repetir contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                {/* Google first */}
                <div className="space-y-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center gap-2 bg-background border border-border cursor-pointer hover:bg-accent/40 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-shadow"
                    onClick={handleGoogleAuth}
                    disabled={isLoginLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.889 32.657 29.355 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.151 7.961 3.039l5.657-5.657C34.869 6.053 29.706 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.151 7.961 3.039l5.657-5.657C34.869 6.053 29.706 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                      <path fill="#4CAF50" d="M24 44c5.304 0 10.152-2.034 13.77-5.343l-6.35-5.371C29.346 34.551 26.773 35.5 24 35.5 18.664 35.5 14.148 32.2 12.41 27.5l-6.51 5.019C8.202 39.494 15.56 44 24 44z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.083 3.157-3.41 5.63-6.583 6.972.003-.001.006-.003.009-.004l6.35 5.371C37.88 37.994 44 32.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                    </svg>
                    {isLoginLoading ? "Redirigiendo a Google..." : "Continuar con Google"}
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-full bg-border/50" />
                    <span className="text-xs text-muted-foreground">o</span>
                    <div className="h-[1px] w-full bg-border/50" />
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="artista@ejemplo.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  {loginError && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{loginError}</div>}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoginLoading}>
                    {isLoginLoading ? "Ingresando..." : "Iniciar sesión"}
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  ¿No tenés cuenta todavía?{" "}
                  <Link href="#" onClick={(e) => { e.preventDefault(); setTab("signup") }} className="text-primary hover:text-primary/80 underline underline-offset-4">
                    Crear una
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
