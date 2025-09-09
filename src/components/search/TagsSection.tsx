import { ScenarioTag } from '@/services/scenariosApi'

interface TagsSectionProps {
  tags: ScenarioTag[]
  selectedTag: ScenarioTag | null
  onTagClick: (tag: ScenarioTag) => void
  isLoading: boolean
  language: 'en' | 'zh'
}

export const TagsSection = ({
  tags,
  selectedTag,
  onTagClick,
  isLoading,
  language,
}: TagsSectionProps) => {
  const getTagName = (tag: ScenarioTag) => {
    return language === 'zh' ? tag.zh_name : tag.en_name
  }

  if (isLoading) {
    return (
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 rounded-full animate-pulse"
              style={{ width: `${Math.random() * 60 + 60}px` }}
            />
          ))}
        </div>
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-2 max-h-24 overflow-hidden">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onTagClick(tag)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors
              ${
                selectedTag?.id === tag.id
                  ? 'bg-blue-100 text-white border-blue-100'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-40 border'
              }
            `}
          >
            {getTagName(tag)}
          </button>
        ))}
      </div>
      {tags.length > 12 && (
        <div className="mt-2">
          <div className="w-full overflow-x-auto">
            <div
              className="flex space-x-2 pb-2"
              style={{ width: 'max-content' }}
            >
              {tags.slice(12).map(tag => (
                <button
                  key={tag.id}
                  onClick={() => onTagClick(tag)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors whitespace-nowrap
                    ${
                      selectedTag?.id === tag.id
                        ? 'bg-blue-100 text-white border-blue-100'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-40 border'
                    }
                  `}
                >
                  {getTagName(tag)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
