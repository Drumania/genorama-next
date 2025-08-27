import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import type { ForumCategory } from "@/lib/types"

interface ForumCategoryCardProps {
  category: ForumCategory
  postCount?: number
}

export function ForumCategoryCard({ category, postCount = 0 }: ForumCategoryCardProps) {
  return (
    <Link href={`/comunidad/categoria/${category.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 border-border cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
                aria-label={`Color de categoría: ${category.color}`}
              />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{category.name}</CardTitle>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {postCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {category.description || "Únete a la conversación en esta categoría"}
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Comunidad activa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
