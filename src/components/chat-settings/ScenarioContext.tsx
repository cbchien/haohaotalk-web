import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import type { Scenario } from '@/services'

interface ScenarioContextProps {
  scenario: Scenario
}

export const ScenarioContext = ({ scenario }: ScenarioContextProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <div>
      <h2>{t.chatSettings.context}</h2>
      <div className="bg-white rounded-2xl p-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {scenario.context}
        </p>
      </div>
    </div>
  )
}
