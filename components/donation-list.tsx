import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, User } from "lucide-react"
import { getProfileDonations, getDonationStats } from "@/lib/supabase/queries"
import type { Profile } from "@/lib/types"

interface DonationListProps {
  recipient: Profile
}

export async function DonationList({ recipient }: DonationListProps) {
  const donations = await getProfileDonations(recipient.id, 10)
  const stats = await getDonationStats(recipient.id)

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{recipient.display_name} aún no ha recibido donaciones.</p>
          <p className="text-sm text-muted-foreground mt-2">¡Sé el primero en apoyar su música!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Apoyo de la Comunidad
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>${stats.totalAmount} recaudados</span>
          <span>{stats.donationCount} donaciones</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="h-8 w-8">
              {donation.is_anonymous ? (
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={donation.donor_profile?.avatar_url || ""} />
                  <AvatarFallback>{donation.donor_profile?.display_name?.charAt(0) || "U"}</AvatarFallback>
                </>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">
                  {donation.is_anonymous ? "Donador anónimo" : donation.donor_profile?.display_name || "Usuario"}
                </p>
                <span className="text-sm font-semibold text-primary">${donation.amount}</span>
              </div>
              {donation.message && <p className="text-sm text-muted-foreground">{donation.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">{new Date(donation.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
