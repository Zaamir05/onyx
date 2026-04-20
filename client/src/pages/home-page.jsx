import { HeroSection } from '../components/marketing/hero-section'
import { StatsSection } from '../components/marketing/stats-section'
import { CapabilitiesSection } from '../components/marketing/capabilities-section'
import { TimelineSection } from '../components/marketing/timeline-section'

export function HomePage() {
  return (
    <div className="aurora-bg min-h-screen pb-12">
      <HeroSection />
      <StatsSection />
      <CapabilitiesSection />
      <TimelineSection />
    </div>
  )
}
