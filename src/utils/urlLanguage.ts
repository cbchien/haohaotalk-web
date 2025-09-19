/**
 * Utility to handle URL-based language switching
 */

export const getLanguageFromURL = (): 'en' | 'zh' | null => {
  if (typeof window === 'undefined') return null

  const urlParams = new URLSearchParams(window.location.search)
  const langParam = urlParams.get('lang')

  if (langParam === 'zh' || langParam === 'en') {
    return langParam as 'en' | 'zh'
  }

  return null
}

export const initializeLanguageFromURL = (
  setLanguage: (lang: 'en' | 'zh') => void
) => {
  const urlLanguage = getLanguageFromURL()

  if (urlLanguage) {
    // Set the language in the store (which will also persist it)
    setLanguage(urlLanguage)

    // Remove the query parameter from URL to keep it clean
    const url = new URL(window.location.href)
    url.searchParams.delete('lang')
    window.history.replaceState({}, '', url.toString())
  }
}
