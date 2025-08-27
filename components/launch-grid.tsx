import { Button } from "@/components/ui/button"
import { LaunchCard } from "@/components/launch-card"
import { getReleases, getReleasesWithUserVotes } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

interface LaunchGridProps {
  sortBy?: "votes" | "recent"
}

export async function LaunchGrid({ sortBy = "votes" }: LaunchGridProps) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get releases with or without user vote data
  const releases = user ? await getReleasesWithUserVotes(user.id, 20, sortBy) : await getReleases(20, sortBy)

  return (
    <section className="py-16 px-4">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Lanzamientos de Hoy</h2>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "votes" ? "default" : "outline"}
              size="sm"
              className={sortBy === "votes" ? "bg-primary" : ""}
              asChild
            >
              <Link href="/?sort=votes">Más Votados</Link>
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              className={sortBy === "recent" ? "bg-primary" : ""}
              asChild
            >
              <Link href="/?sort=recent">Más Recientes</Link>
            </Button>
            <Button variant="outline" size="sm" disabled>
              Por Género
            </Button>
          </div>
        </div>

        {releases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay lanzamientos disponibles aún.</p>
            <p className="text-muted-foreground text-sm mt-2">¡Sé el primero en compartir tu música!</p>
            {user && (
              <Button className="mt-4" asChild>
                <Link href="/submit">Subir Mi Música</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release) => (
              <LaunchCard key={release.id} release={release} />
            ))}
          </div>
        )}

        {releases.length >= 20 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Cargar Más Lanzamientos
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
