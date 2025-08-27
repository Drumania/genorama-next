"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { toggleVote } from "@/lib/supabase/actions"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"

interface VoteButtonProps {
  releaseId: string
  initialVoteCount: number
  initialUserVoted: boolean
}

export function VoteButton({ releaseId, initialVoteCount, initialUserVoted }: VoteButtonProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [userVoted, setUserVoted] = useState(initialUserVoted)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleVote = () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    startTransition(async () => {
      const result = await toggleVote(releaseId)

      if (result.error) {
        console.error("Vote error:", result.error)
        return
      }

      if (result.success) {
        if (result.action === "added") {
          setVoteCount((prev) => prev + 1)
          setUserVoted(true)
        } else {
          setVoteCount((prev) => prev - 1)
          setUserVoted(false)
        }
      }
    })
  }

  return (
    <Button
      variant={userVoted ? "default" : "outline"}
      size="sm"
      className={`flex items-center gap-2 transition-all ${
        userVoted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-transparent hover:bg-primary/10"
      }`}
      onClick={handleVote}
      disabled={isPending}
    >
      <ChevronUp className={`h-4 w-4 transition-transform ${userVoted ? "text-primary-foreground" : ""}`} />
      {voteCount}
    </Button>
  )
}
