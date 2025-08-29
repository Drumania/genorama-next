import { DonationList } from "@/components/donation-list"
import type { Profile } from "@/lib/types"

interface Props {
  profile: Profile
}

export default function ProfileDonationsSection({ profile }: Props) {
  return (
    <section className="container max-w-[1200px] mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Apoyos</h2>
      <DonationList recipient={profile} />
    </section>
  )
}

