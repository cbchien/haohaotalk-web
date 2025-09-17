import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

export const PWAUpdateNotification = () => {
  const [needRefresh, setNeedRefresh] = useState(false)
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setNeedRefresh(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
        <div className="flex items-center gap-3">
          <span>{t.common.appUpdated}</span>
          <button
            onClick={handleRefresh}
            className="text-blue-300 hover:text-blue-200 underline"
          >
            {t.common.refresh}
          </button>
        </div>
      </div>
    </div>
  )
}
