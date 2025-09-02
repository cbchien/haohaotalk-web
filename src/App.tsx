import { useEffect, useCallback, useRef } from 'react'
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
import { HowToUsePage } from './screens/HowToUsePage'
import { ConnectionScorePage } from './screens/ConnectionScorePage'
import { PrivacyPolicyPage } from './screens/PrivacyPolicyPage'
import { TermsOfUsePage } from './screens/TermsOfUsePage'
import { ContactUsPage } from './screens/ContactUsPage'
import { LanguagePage } from './screens/LanguagePage'
import { DeleteAccountPage } from './screens/DeleteAccountPage'
import { ChatSettingsScreen } from './components/chat-settings'
import { ChatScreen } from './components/chat'
import { SessionInsightsPage } from './screens/SessionInsightsPage'
import { SessionPerfComparisonPage } from './screens/SessionPerfComparisonPage'
import { useAuthStore, useAppStore } from './store'
import { OnboardingAPI } from './services/onboardingApi'

function AppContent() {
  const location = useLocation()
  const { authLoadingType, user, isAuthenticated } = useAuthStore()
  const { onboarding, showOnboarding, completeOnboarding } = useAppStore()

  // Check onboarding status for authenticated users
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (
        isAuthenticated &&
        user &&
        !user.isGuest &&
        !onboarding.hasCompletedOnboarding
      ) {
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
          // Fallback to local storage for offline scenarios
          const localStatus = OnboardingAPI.getLocalOnboardingStatus(user.id)
          if (!localStatus) {
            setTimeout(() => showOnboarding(), 1000)
          }
        }
      }
    }

    checkOnboardingStatus()
  }, [isAuthenticated, user, onboarding.hasCompletedOnboarding, showOnboarding])

  const handleOnboardingComplete = async () => {
    if (user && !user.isGuest) {
      try {
        await OnboardingAPI.updateOnboardingStatus(true)
        OnboardingAPI.setLocalOnboardingStatus(user.id, true)
      } catch {
        // Still complete locally even if API fails
        OnboardingAPI.setLocalOnboardingStatus(user.id, true)
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
