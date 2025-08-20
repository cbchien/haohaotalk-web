interface InsightItemProps {
  icon: string
  text: string
  backgroundColor: string
}

export const InsightItem = ({
  icon,
  text,
  backgroundColor,
}: InsightItemProps) => {
  return (
    <div
      className={`${backgroundColor} rounded-xl p-4 flex items-start space-x-3`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
