import { Suspense } from "react"
import { UserSettings } from "@/components/user-settings"
import { UserSettingsSkeleton } from "@/components/user-settings-skeleton"

export default function ConfiguracionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<UserSettingsSkeleton />}>
        <UserSettings />
      </Suspense>
    </div>
  )
}
