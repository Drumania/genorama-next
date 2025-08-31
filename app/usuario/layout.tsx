import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Perfil de Usuario | Genorama",
  description: "Perfil personal de usuario en Genorama - Descubre música, conecta con artistas y participa en la comunidad musical.",
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
