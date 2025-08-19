import { useAppStore } from '@/store'

const categories = [
  { id: 'featured', label: '本週推薦', label_en: 'This Week' },
  { id: 'relationship', label: '情侶關係', label_en: 'Relationships' },
  { id: 'family', label: '親子關係', label_en: 'Family' },
  { id: 'workplace', label: '職場', label_en: 'Workplace' },
]

export const CategoryChips = () => {
  const { selectedCategories, setSelectedCategories, currentLanguage } =
    useAppStore()

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId)

    if (isSelected) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    } else {
      // For now, only allow one category selection to match design
      setSelectedCategories([categoryId])
    }
  }

  return (
    <div className="px-4 py-4 bg-white">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category.id)
          const isFirst = category.id === 'featured'

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isSelected || (selectedCategories.length === 0 && isFirst)
                  ? 'bg-blue-100 text-white'
                  : 'bg-blue-10 text-blue-100 hover:bg-blue-25'
              }`}
            >
              {currentLanguage === 'zh' ? category.label : category.label_en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
