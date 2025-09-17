import { CategoryChips } from '@/components/home/CategoryChips'
import { ScenarioGrid } from '@/components/home/FeaturedScenarios'
import { PWAUpdateNotification } from '@/components/common/PWAUpdateNotification'

export const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-safe">
      <CategoryChips />
      <ScenarioGrid />
      <PWAUpdateNotification />
    </div>
  )
}
