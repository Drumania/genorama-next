"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, MessageSquare, Pin, Send } from "lucide-react"
import Link from "next/link"
import { getForumPost, getForumReplies } from "@/lib/supabase/queries"
import { createForumReply } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import type { ForumPost, ForumReply } from "@/lib/types"

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [replyContent, setReplyContent] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, repliesData] = await Promise.all([getForumPost(params.id), getForumReplies(params.id)])

        if (!postData) {
          notFound()
          return
        }

        setPost(postData)
        setReplies(repliesData)

        // Check authentication
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error("Error fetching post data:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (!replyContent.trim()) {
      setError("El contenido de la respuesta es obligatorio")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("content", replyContent.trim())
      formData.append("postId", params.id)

      const result = await createForumReply(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setReplyContent("")
        // Refresh replies
        const updatedReplies = await getForumReplies(params.id)
        setReplies(updatedReplies)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/comunidad/categoria/${post.category_id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {post.category?.name}
            </Link>
          </Button>
        </div>

        {/* Post */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar_url || ""} />
                <AvatarFallback>{post.author?.display_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {post.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                  <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>por {post.author?.display_name || "Usuario"}</span>
                  <span>•</span>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: post.category?.color, color: post.category?.color }}
                  >
                    {post.category?.name}
                  </Badge>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {replies.length} {replies.length === 1 ? "Respuesta" : "Respuestas"}
            </h2>
          </div>

          {/* Reply Form */}
          {isAuthenticated ? (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleReplySubmit} className="space-y-4">
                  <Textarea
                    placeholder="Escribe tu respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-24"
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">{replyContent.length}/1000 caracteres</div>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                    <Button type="submit" disabled={isPending || !replyContent.trim()}>
                      {isPending ? "Enviando..." : "Responder"}
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Inicia sesión para participar en la conversación</p>
                <Button asChild>
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Replies */}
          {replies.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aún no hay respuestas</p>
              <p className="text-muted-foreground text-sm mt-2">¡Sé el primero en responder!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Card key={reply.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={reply.author?.avatar_url || ""} />
                        <AvatarFallback>{reply.author?.display_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{reply.author?.display_name || "Usuario"}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none text-foreground">
                          <p className="whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
