import { XMarkIcon } from '@heroicons/react/24/outline'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationMode = 'modal' | 'inline' | 'banner'

interface NotificationProps {
  title?: string
  message: string
  type?: NotificationType
  mode?: NotificationMode
  isVisible: boolean
  onDismiss?: () => void
  dismissible?: boolean
  icon?: string
  className?: string
  buttonText?: string
}

export const Notification = ({
  title,
  message,
  type = 'info',
  mode = 'modal',
  isVisible,
  onDismiss,
  dismissible = true,
  icon,
  className = '',
  buttonText = 'Got it'
}: NotificationProps) => {
  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const displayIcon = icon || getDefaultIcon()

  // Modal mode - overlay with backdrop
  if (mode === 'modal') {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={e => {
          if (e.target === e.currentTarget && dismissible && onDismiss) {
            onDismiss()
          }
        }}
      >
        <div className={`bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl ${className}`}>
          <div className="text-center">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {title}
              </h3>
            )}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {message}
            </p>
            {dismissible && onDismiss && (
              <button
                onClick={onDismiss}
                className="px-6 py-2 bg-blue-100 text-white rounded-lg text-sm hover:bg-blue-200 transition-colors"
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Banner mode - full width at top
  if (mode === 'banner') {
    return (
      <div className={`w-full border-l-4 p-4 ${getTypeStyles()} ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <span className="text-lg">{displayIcon}</span>
          </div>
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold mb-1">
                {title}
              </h4>
            )}
            <p className="text-sm">
              {message}
            </p>
          </div>
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Inline mode - compact notification within content
  return (
    <div className={`rounded-lg border p-3 ${getTypeStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2">
          <span className="text-base">{displayIcon}</span>
        </div>
        <div className="flex-1">
          {title && (
            <h5 className="font-medium text-sm mb-1">
              {title}
            </h5>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}