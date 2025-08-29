"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CreatePostModal } from "@/components/create-post-modal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { ForumCategory } from "@/lib/types"

interface Props {
  categories: ForumCategory[]
}

export default function CreatePostCta({ categories }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    check()
  }, [])

  const onClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/signup?tab=login")
      return
    }
    setIsOpen(true)
  }

  return (
    <>
      <Button onClick={onClick} className="flex items-center gap-2">Crear Post</Button>
      <CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} categories={categories} />
    </>
  )
}

