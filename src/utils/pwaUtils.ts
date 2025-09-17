// PWA utilities for cache management and updates

export const clearAllCaches = async (): Promise<void> => {
  try {
    // Clear all caches
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))

    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(
        registrations.map(registration => registration.unregister())
      )
    }

    console.log('All caches cleared and service worker unregistered')
  } catch (error) {
    console.error('Error clearing caches:', error)
  }
}

export const forceReload = (): void => {
  // Clear caches and force reload
  clearAllCaches().then(() => {
    window.location.reload()
  })
}

export const checkForUpdates = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.update()
      return registration.waiting !== null
    } catch (error) {
      console.error('Error checking for updates:', error)
      return false
    }
  }
  return false
}

// For debugging - add to window object in development
if (import.meta.env.DEV) {
  (window as any).PWAUtils = {
    clearAllCaches,
    forceReload,
    checkForUpdates,
  }
}
