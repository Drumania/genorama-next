import { Hero } from "@/components/hero"
import { HardcodedTodayLaunches } from "@/components/hardcoded-today-launches"
import { HardcodedSidebarLaunches } from "@/components/hardcoded-sidebar-launches"

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="px-4 py-8">
        <div className="container max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <HardcodedTodayLaunches />
            </div>
            <div className="lg:col-span-4">
              <HardcodedSidebarLaunches />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
