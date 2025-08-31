import { Suspense } from "react"
import { UserProfileSimple } from "@/components/user-profile-simple"
import { UserProfileSkeleton } from "@/components/user-profile-skeleton"

interface UserProfilePageProps {
  params: {
    username: string
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileSimple username={username} />
      </Suspense>
    </div>
  )
}
