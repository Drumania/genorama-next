"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createForumPost } from "@/lib/supabase/actions"
import { useRouter } from "next/navigation"
import type { ForumCategory } from "@/lib/types"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  categories: ForumCategory[]
  selectedCategoryId?: string
}

export function CreatePostModal({ isOpen, onClose, categories, selectedCategoryId }: CreatePostModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState(selectedCategoryId || "")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Todos los campos son obligatorios")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("content", content.trim())
      formData.append("categoryId", categoryId)

      const result = await createForumPost(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onClose()
        setTitle("")
        setContent("")
        setCategoryId("")
        router.push(`/comunidad/post/${result.postId}`)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear nuevo post</DialogTitle>
          <DialogDescription>Comparte tus ideas y participa en la conversación musical</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="¿De qué quieres hablar?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              placeholder="Comparte tus pensamientos, preguntas o experiencias..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 min-h-32"
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground mt-1">{content.length}/2000 caracteres</div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Publicando..." : "Publicar Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
