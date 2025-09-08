import { createClient } from "@/lib/supabase/server"
import { getDonationsGiven, getDonationsReceived } from "@/lib/supabase/queries"
import { DonationsClient } from "./donations-client"
import { redirect } from "next/navigation"

export default async function DonacionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [donationsGiven, donationsReceived] = await Promise.all([
    getDonationsGiven(user.id),
    getDonationsReceived(user.id),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DonationsClient 
        initialDonationsGiven={donationsGiven}
        initialDonationsReceived={donationsReceived}
      />
    </div>
  )
}