import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface ProfileMenuItemProps {
  title: string
  onClick: () => void
  variant?: 'default' | 'danger'
  showArrow?: boolean
}

export const ProfileMenuItem = ({
  title,
  onClick,
  variant = 'default',
  showArrow = true,
}: ProfileMenuItemProps) => {
  const baseClasses =
    'w-full flex items-center justify-between p-4 text-left transition-colors'
  const variantClasses =
    variant === 'danger'
      ? 'text-red-600 hover:bg-red-50'
      : 'text-gray-900 hover:bg-gray-50'

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      <span className="font-medium">{title}</span>
      {showArrow && <ChevronRightIcon className="w-5 h-5 text-gray-400" />}
    </button>
  )
}
