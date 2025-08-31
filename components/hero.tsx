import { Button } from "@/components/ui/button"
import { Play, TrendingUp } from "lucide-react"

export function Hero() {
  return (
    <section className="py-12 px-4">
      <div className="container max-w-[1200px] mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
          Descubre los ultimos <span className="text-primary">lanzamientos musicales</span>
        </h1>
        {/* <p className="text-lg md:text-xl text-muted-foreground text-balance mb-6 max-w-2xl mx-auto">
          La plataforma donde músicos comparten sus nuevos lanzamientos, y la comunidad vota por sus favoritos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="text-base md:text-lg px-6 md:px-8">
            <Play className="h-5 w-5 mr-2" />
            Explorar Lanzamientos
          </Button>
          <Button variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 bg-transparent">
            <TrendingUp className="h-5 w-5 mr-2" />
            Subir Mi Música
          </Button>
        </div> */}
      </div>
    </section>
  )
}
