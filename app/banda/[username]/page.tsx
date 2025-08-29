import { getProfileByUsername, getProfileReleases } from "@/lib/supabase/queries"
import { notFound } from "next/navigation"
import { BandProfileClient } from "@/components/band-profile-client"
import ProfileDonationsSection from "@/components/profile-donations-section"

interface BandProfilePageProps {
  params: { username: string }
}

export default async function BandProfilePage({ params }: BandProfilePageProps) {
  const profile = await getProfileByUsername(params.username)
  if (!profile) {
    notFound()
  }
  const releases = await getProfileReleases(profile.id)

  return (
    <>
      <BandProfileClient profile={profile} releases={releases} />
      <ProfileDonationsSection profile={profile} />
    </>
  )
}
