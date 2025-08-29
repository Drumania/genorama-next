import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
          <CardDescription>
            Te hemos enviado un email de confirmación. Por favor revisa tu bandeja de entrada y haz clic en el enlace
            para activar tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Una vez que confirmes tu email, podrás acceder a todas las funciones de Genorama.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signup?tab=login">Ir a Iniciar sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
