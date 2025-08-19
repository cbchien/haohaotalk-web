import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface ScreenHeaderProps {
  title: string
  leftContent?: React.ReactNode
  onBack: () => void
  className?: string
}

export const ScreenHeader = ({
  title,
  leftContent,
  onBack,
  className = '',
}: ScreenHeaderProps) => {
  return (
    <header
      className={`sticky top-0 z-10 bg-white border-b border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>

        {leftContent && <div className="flex-shrink-0">{leftContent}</div>}

        <h1 className="truncate">{title}</h1>
      </div>
    </header>
  )
}
