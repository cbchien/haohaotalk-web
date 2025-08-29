/**
 * Browser language detection utility
 */

export type SupportedLanguage = 'en' | 'zh'

/**
 * Detects the user's preferred language from browser settings
 * Returns 'en' for English-based locales, 'zh' for Chinese-based locales
 * Defaults to 'zh' if unable to determine or unsupported language
 */
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') {
    return 'zh' // Default to Chinese on server-side
  }

  // Get user's preferred languages
  const languages = navigator.languages || [navigator.language]

  for (const lang of languages) {
    const langCode = lang.toLowerCase()
    
    // Check for English variants
    if (langCode.startsWith('en')) {
      return 'en'
    }
    
    // Check for Chinese variants (zh, zh-CN, zh-TW, zh-HK, etc.)
    if (langCode.startsWith('zh')) {
      return 'zh'
    }
  }

  // Default to Chinese if no supported language detected
  return 'zh'
}

/**
 * Gets the default language for new users/logout scenario
 * Uses browser language detection as the primary method
 */
export function getDefaultLanguage(): SupportedLanguage {
  return detectBrowserLanguage()
}