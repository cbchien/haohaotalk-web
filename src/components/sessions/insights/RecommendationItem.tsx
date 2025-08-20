interface RecommendationItemProps {
  icon: string
  category: string
  description: string
}

export const RecommendationItem = ({
  icon,
  category,
  description,
}: RecommendationItemProps) => {
  return (
    <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{category}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
