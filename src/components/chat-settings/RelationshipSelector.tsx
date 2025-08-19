import { useTranslation } from '@/utils/translations'

type RelationshipLevel = 'low' | 'normal' | 'high'

interface RelationshipSelectorProps {
  selectedLevel: RelationshipLevel
  onLevelSelect: (level: RelationshipLevel) => void
  language: 'en' | 'zh'
}

const relationshipLevelKeys: RelationshipLevel[] = ['low', 'normal', 'high']

export const RelationshipSelector = ({
  selectedLevel,
  onLevelSelect,
  language,
}: RelationshipSelectorProps) => {
  const t = useTranslation(language)

  return (
    <div>
      <h2>{t.chatSettings.relationshipStrength}</h2>
      <div className="flex gap-3">
        {relationshipLevelKeys.map(level => {
          const isSelected = selectedLevel === level
          const optionLabel = t.chatSettings.relationship[level]

          return (
            <button
              key={level}
              onClick={() => onLevelSelect(level)}
              className={`flex-1 px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-100 bg-blue-10 text-blue-100'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-40'
              }`}
            >
              <span className="text-sm font-medium">{optionLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
