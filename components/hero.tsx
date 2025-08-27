import { Button } from "@/components/ui/button"
import { Play, TrendingUp } from "lucide-react"

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Descubre los mejores <span className="text-primary">lanzamientos musicales</span>
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
          La plataforma donde músicos y bandas comparten sus nuevos lanzamientos, y la comunidad vota por sus favoritos.
          Como Product Hunt, pero para música.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            <Play className="h-5 w-5 mr-2" />
            Explorar Lanzamientos
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
            <TrendingUp className="h-5 w-5 mr-2" />
            Subir Mi Música
          </Button>
        </div>
      </div>
    </section>
  )
}
