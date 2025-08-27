import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { LaunchGrid } from "@/components/launch-grid"
import { Suspense } from "react"

interface HomePageProps {
  searchParams: { sort?: "votes" | "recent" }
}

export default function HomePage({ searchParams }: HomePageProps) {
  const sortBy = searchParams.sort || "votes"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Suspense
          fallback={
            <div className="py-16 px-4">
              <div className="container">
                <div className="text-center">
                  <p className="text-muted-foreground">Cargando lanzamientos...</p>
                </div>
              </div>
            </div>
          }
        >
          <LaunchGrid sortBy={sortBy} />
        </Suspense>
      </main>
    </div>
  )
}
