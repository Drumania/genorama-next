"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [isBand, setIsBand] = useState(true)
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
            is_band: isBand,
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
                      placeholder="tu_nombre_de_banda"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nombre para mostrar</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Nombre de tu banda"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isBand" checked={isBand} onCheckedChange={(checked) => setIsBand(checked as boolean)} />
                    <Label htmlFor="isBand" className="text-sm">
                      Soy banda/artista (destildá si sos fan)
                    </Label>
                  </div>
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
                  <div className="text-center text-xs text-muted-foreground">o</div>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={isLoginLoading}>
                    {isLoginLoading ? "Redirigiendo a Google..." : "Continuar con Google"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
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
                  <div className="text-center text-xs text-muted-foreground">o</div>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={isLoginLoading}>
                    {isLoginLoading ? "Redirigiendo a Google..." : "Continuar con Google"}
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
