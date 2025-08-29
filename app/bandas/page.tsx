import { ProfileCard } from "@/components/profile-card"
import { getProfiles } from "@/lib/supabase/queries"
import { SearchBandas } from "@/components/search-bandas"

interface BandasPageProps {
  searchParams: { search?: string; genre?: string }
}

export default async function BandasPage({ searchParams }: BandasPageProps) {
  const search = searchParams.search
  const genre = searchParams.genre
  const profiles = await getProfiles(20, search)

  const filteredProfiles = genre
    ? profiles.filter((profile) => profile.genres?.some((g) => g.toLowerCase().includes(genre.toLowerCase())))
    : profiles

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1200px] mx-auto py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Descubre Artistas</h1>
          <p className="text-lg text-muted-foreground mb-6">Explora la comunidad de músicos y bandas en Genorama</p>

          <SearchBandas initialSearch={search} initialGenre={genre} />
        </div>

        {/* Results */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {search || genre ? "No se encontraron artistas con esos criterios." : "No hay artistas registrados aún."}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              {search || genre ? "Intenta con otros términos de búsqueda." : "¡Sé el primero en unirte a la comunidad!"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {search || genre
                  ? `${filteredProfiles.length} resultados encontrados`
                  : `${filteredProfiles.length} artistas encontrados`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
