import { Button } from "@/components/ui/button"
import { ForumCategoryCard } from "@/components/forum-category-card"
import { ForumPostCard } from "@/components/forum-post-card"
import { Plus, MessageSquare, TrendingUp, Clock } from "lucide-react"
import { getForumCategories, getForumPosts } from "@/lib/supabase/queries"
import CreatePostCta from "@/components/create-post-cta"

export default async function ComunidadPage() {
  const [categories, recentPosts] = await Promise.all([getForumCategories(), getForumPosts(undefined, 10)])

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1200px] mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Comunidad Musical</h1>
            <p className="text-lg text-muted-foreground">
              Conecta con otros músicos, comparte experiencias y aprende juntos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <CreatePostCta categories={categories} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Categorías</h2>
              </div>
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay categorías disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <ForumCategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </section>

            {/* Recent Posts */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Actividad Reciente</h2>
              </div>
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Aún no hay posts en la comunidad</p>
                  <p className="text-muted-foreground text-sm mt-2">¡Sé el primero en iniciar una conversación!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <ForumPostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categorías</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posts recientes</span>
                  <span className="font-medium">{recentPosts.length}</span>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Normas de la Comunidad</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Respeta a todos los miembros</li>
                <li>• Mantén las discusiones relacionadas con música</li>
                <li>• No spam ni autopromoción excesiva</li>
                <li>• Comparte conocimiento y experiencias</li>
                <li>• Ayuda a crear un ambiente positivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal se maneja en CreatePostCta */}
    </div>
  )
}
