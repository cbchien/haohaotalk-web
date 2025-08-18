import { CategoryChips } from '@/components/home/CategoryChips'
import { ScenarioGrid } from '@/components/home/FeaturedScenarios'

export const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-safe">
      <CategoryChips />
      <ScenarioGrid />
    </div>
  )
}
