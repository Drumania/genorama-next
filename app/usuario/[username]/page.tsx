import { UserProfile } from "@/components/user-profile"

interface UserPageProps {
  params: {
    username: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  return <UserProfile username={params.username} />
}

export const metadata = {
  title: "Perfil de Usuario | Genorama",
  description: "Perfil de usuario en Genorama - Descubre sus bandas y actividad musical"
}
