import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Pin, Clock } from "lucide-react"
import Link from "next/link"
import type { ForumPost } from "@/lib/types"

interface ForumPostCardProps {
  post: ForumPost
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  const timeAgo = new Date(post.last_reply_at).toLocaleDateString()

  return (
    <Link href={`/comunidad/post/${post.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 border-border cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar_url || ""} />
              <AvatarFallback>{post.author?.display_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {post.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {post.title}
                </h3>
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
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.content}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{post.reply_count} respuestas</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Última actividad: {timeAgo}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
