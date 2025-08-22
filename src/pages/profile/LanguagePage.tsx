import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ProfilePageLayout } from './components/ProfilePageLayout'

export const LanguagePage = () => {
  const { currentLanguage, setLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const languages = [
    { code: 'zh' as const, name: t.profile.language.chinese },
    { code: 'en' as const, name: t.profile.language.english },
  ]

  const handleLanguageChange = (languageCode: 'zh' | 'en') => {
    setLanguage(languageCode)
  }

  return (
    <ProfilePageLayout title={t.profile.menu.language}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 mb-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t.profile.language.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {t.profile.language.description}
          </p>
        </div>

        {languages.map((language, index) => (
          <div key={language.code}>
            <button
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                currentLanguage === language.code ? 'bg-blue-50' : ''
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                index === languages.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {language.name}
                  </div>
                </div>
              </div>

              {currentLanguage === language.code && (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </button>
            {index < languages.length - 1 && (
              <div className="border-b border-gray-100 mx-4" />
            )}
          </div>
        ))}
      </div>
    </ProfilePageLayout>
  )
}
