"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ForumPostCard } from "@/components/forum-post-card"
import { CreatePostModal } from "@/components/create-post-modal"
import { ArrowLeft, Plus, MessageSquare } from "lucide-react"
import Link from "next/link"
import { getCategoryById, getForumPosts, getForumCategories } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import type { ForumCategory, ForumPost } from "@/lib/types"

interface CategoryPageProps {
  params: { id: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<ForumCategory | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, postsData, categoriesData] = await Promise.all([
          getCategoryById(params.id),
          getForumPosts(params.id),
          getForumCategories(),
        ])

        if (!categoryData) {
          notFound()
          return
        }

        setCategory(categoryData)
        setPosts(postsData)
        setCategories(categoriesData)

        // Check authentication
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error("Error fetching category data:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      router.push("/auth/signup?tab=login")
      return
    }
    setIsCreateModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando categoría...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/comunidad">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Comunidad
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }} />
            <div>
              <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {category.description || "Participa en las discusiones de esta categoría"}
              </p>
            </div>
          </div>
          <Button onClick={handleCreatePost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Post
          </Button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Posts en {category.name}</h2>
            <span className="text-muted-foreground text-sm">{posts.length} posts</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Aún no hay posts en esta categoría</p>
              <p className="text-muted-foreground text-sm mt-2">¡Sé el primero en iniciar una conversación!</p>
              <Button onClick={handleCreatePost} className="mt-4">
                Crear el primer post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        selectedCategoryId={category.id}
      />
    </div>
  )
}
