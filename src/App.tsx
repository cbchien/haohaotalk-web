import { useEffect, useCallback, useRef, Suspense, lazy } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { AuthGuard } from './components/auth/AuthGuard'
import { AuthLoadingPage } from './components/auth/AuthLoadingPage'
import { BottomTabBar } from './components/navigation/BottomTabBar'
import { OnboardingModal } from './components/onboarding'
import { HomeScreen } from './screens/HomeScreen'
import { LandingPage } from './components/landing'
import { SearchScreen } from './screens/SearchScreen'
import { SessionsScreen } from './screens/SessionsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ChatSettingsScreen } from './components/chat-settings'
import { useAuthStore, useAppStore } from './store'
import { OnboardingAPI } from './services/onboardingApi'

// Lazy load heavy components
const ChatScreen = lazy(() =>
  import('./components/chat').then(module => ({ default: module.ChatScreen }))
)
const SessionInsightsPage = lazy(() =>
  import('./screens/SessionInsightsPage').then(module => ({
    default: module.SessionInsightsPage,
  }))
)
const SessionPerfComparisonPage = lazy(() =>
  import('./screens/SessionPerfComparisonPage').then(module => ({
    default: module.SessionPerfComparisonPage,
  }))
)

// Lazy load profile pages (less frequently used)
const HowToUsePage = lazy(() =>
  import('./screens/HowToUsePage').then(module => ({
    default: module.HowToUsePage,
  }))
)
const ConnectionScorePage = lazy(() =>
  import('./screens/ConnectionScorePage').then(module => ({
    default: module.ConnectionScorePage,
  }))
)
const PrivacyPolicyPage = lazy(() =>
  import('./screens/PrivacyPolicyPage').then(module => ({
    default: module.PrivacyPolicyPage,
  }))
)
const TermsOfUsePage = lazy(() =>
  import('./screens/TermsOfUsePage').then(module => ({
    default: module.TermsOfUsePage,
  }))
)
const ContactUsPage = lazy(() =>
  import('./screens/ContactUsPage').then(module => ({
    default: module.ContactUsPage,
  }))
)
const LanguagePage = lazy(() =>
  import('./screens/LanguagePage').then(module => ({
    default: module.LanguagePage,
  }))
)
const DeleteAccountPage = lazy(() =>
  import('./screens/DeleteAccountPage').then(module => ({
    default: module.DeleteAccountPage,
  }))
)

function AppContent() {
  const location = useLocation()
  const { authLoadingType, user, isAuthenticated } = useAuthStore()
  const { onboarding, showOnboarding, completeOnboarding } = useAppStore()

  // Check onboarding status for authenticated users
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isAuthenticated && user && !user.isGuest) {
        try {
          const response = await OnboardingAPI.getOnboardingStatus()
          if (
            response.success &&
            response.data &&
            !response.data.user.onboardingCompleted
          ) {
            setTimeout(() => showOnboarding(), 1000) // Delay for smooth UX
          }
        } catch {
          // Show onboarding if API fails - let server be source of truth
          setTimeout(() => showOnboarding(), 1000)
        }
      }
    }

    checkOnboardingStatus()
  }, [isAuthenticated, user, showOnboarding])

  const handleOnboardingComplete = async () => {
    if (user && !user.isGuest) {
      try {
        await OnboardingAPI.updateOnboardingStatus(true)
      } catch {
        // API failed but still complete in app state
      }
    }
    completeOnboarding()
  }

  // Show loading page during auth operations
  if (authLoadingType) {
    return <AuthLoadingPage type={authLoadingType} />
  }

  // Hide bottom navigation on fullscreen routes (chat, analytics, and landing page)
  const hiddenBottomNavRoutes = ['/session/', '/chat']
  const hideBottomNav =
    location.pathname === '/' ||
    hiddenBottomNavRoutes.some(route => location.pathname.includes(route))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className={hideBottomNav ? '' : 'pb-16'}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-white">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-100 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/sessions" element={<SessionsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/profile/how-to-use" element={<HowToUsePage />} />
            <Route
              path="/profile/connection-score"
              element={<ConnectionScorePage />}
            />
            <Route path="/profile/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/profile/terms" element={<TermsOfUsePage />} />
            <Route path="/profile/contact" element={<ContactUsPage />} />
            <Route path="/profile/language" element={<LanguagePage />} />
            <Route
              path="/profile/delete-account"
              element={<DeleteAccountPage />}
            />
            <Route
              path="/scenario/:scenarioId/configure"
              element={<ChatSettingsScreen />}
            />
            <Route path="/session/:sessionId/chat" element={<ChatScreen />} />
            <Route
              path="/session/:sessionId/insights"
              element={<SessionInsightsPage />}
            />
            <Route
              path="/session/:sessionId/performance-comparison"
              element={<SessionPerfComparisonPage />}
            />
          </Routes>
        </Suspense>
      </main>

      {/* Bottom Navigation - Hidden during chat sessions */}
      {!hideBottomNav && <BottomTabBar />}

      {/* Onboarding Modal */}
      <OnboardingModal
        isVisible={onboarding?.isVisible || false}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingComplete}
      />
    </div>
  )
}

function App() {
  const { initializeAuth, refreshAuth, isInitialized, authToken } =
    useAuthStore()

  useEffect(() => {
    // Initialize authentication on app startup
    initializeAuth()
  }, [initializeAuth])

  // Use refs to avoid recreating event handlers on every dependency change
  const isInitializedRef = useRef(isInitialized)
  const authTokenRef = useRef(authToken)

  // Update refs when values change
  useEffect(() => {
    isInitializedRef.current = isInitialized
  }, [isInitialized])

  useEffect(() => {
    authTokenRef.current = authToken
  }, [authToken])

  // Memoize the refresh handlers to prevent effect recreation
  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden && isInitializedRef.current && authTokenRef.current) {
      refreshAuth()
    }
  }, [refreshAuth])

  const handleWindowFocus = useCallback(() => {
    if (isInitializedRef.current && authTokenRef.current) {
      refreshAuth()
    }
  }, [refreshAuth])

  useEffect(() => {
    // Add event listeners only once (or when handlers change)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [handleVisibilityChange, handleWindowFocus])

  return (
    <Router>
      <AuthGuard>
        <AppContent />
      </AuthGuard>
    </Router>
  )
}

export default App
