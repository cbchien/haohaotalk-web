import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

export const HeroSection = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isInitialized, setShowAuthModal } =
    useAuthStore()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Redirect authenticated users to /home, but only after auth is initialized
  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      navigate('/home')
    }
  }, [isInitialized, isAuthenticated, user, navigate])

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      navigate('/home')
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="min-h-[95vh] md:min-h-[80vh] relative overflow-hidden bg-gradient-to-br from-blue-10 via-white to-blue-25">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-10/50 to-transparent"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-25/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-55/20 rounded-full blur-lg"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-40/40 rounded-full blur-md"></div>

      {/* Five scattered floating dots - positioned relative to full hero section */}
      <div className="absolute top-1/4 left-7 animate-bounce delay-1000">
        <div className="w-3 h-3 bg-blue-55/60 rounded-full"></div>
      </div>

      <div className="absolute top-1/2 right-8 animate-pulse delay-2000">
        <div className="w-2 h-2 bg-blue-75/60 rounded-full"></div>
      </div>

      <div className="absolute top-1/8 right-8 animate-bounce delay-3000">
        <div className="w-2.5 h-2.5 bg-blue-55/50 rounded-full"></div>
      </div>

      <div className="absolute top-3/5 right-1/3 animate-pulse delay-1500">
        <div className="w-1.5 h-1.5 bg-blue-40/60 rounded-full"></div>
      </div>

      <div className="absolute bottom-1/4 left-1/6 animate-bounce delay-4000">
        <div className="w-2 h-2 bg-blue-100/50 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[95vh] md:min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Conversation bubble icon */}
        <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
          <svg
            className="w-12 h-12 text-blue-100"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-100 to-gray-800 bg-clip-text text-transparent mb-6 leading-tight">
          {t.landing.heroTitle}
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl leading-relaxed font-medium">
          {t.landing.heroSubtitle}
        </p>

        {/* Enhanced CTA button */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-75 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <button
            onClick={handleGetStarted}
            className="relative bg-gradient-to-r from-blue-100 to-blue-75 text-white px-12 py-5 rounded-2xl text-lg font-semibold hover:from-blue-75 hover:to-blue-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
          >
            {t.landing.startPracticing}
            <svg
              className="inline-block ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
