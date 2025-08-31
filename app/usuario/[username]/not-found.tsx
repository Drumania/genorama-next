import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Home, Search } from "lucide-react"

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 p-6">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Usuario no encontrado</h1>
          <p className="text-muted-foreground max-w-md">
            El usuario que estás buscando no existe o ha sido eliminado.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/bandas">
              <Search className="h-4 w-4 mr-2" />
              Explorar artistas
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
