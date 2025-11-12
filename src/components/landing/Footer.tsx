import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

export const Footer = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-300">{t.footer.copyright}</div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.guidedcorner.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
              {t.footer.guidedCorner}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
