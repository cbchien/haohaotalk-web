import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { AuthGuard } from './components/auth/AuthGuard'
import { BottomTabBar } from './components/navigation/BottomTabBar'
import { HomeScreen } from './screens/HomeScreen'
import { SearchScreen } from './screens/SearchScreen'
import { SessionsScreen } from './screens/SessionsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { HowToUsePage } from './pages/profile/HowToUsePage'
import { ConnectionScorePage } from './pages/profile/ConnectionScorePage'
import { PrivacyPolicyPage } from './pages/profile/PrivacyPolicyPage'
import { TermsOfUsePage } from './pages/profile/TermsOfUsePage'
import { ContactUsPage } from './pages/profile/ContactUsPage'
import { LanguagePage } from './pages/profile/LanguagePage'
import { DeleteAccountPage } from './pages/profile/DeleteAccountPage'
import { ChatSettingsScreen } from './components/chat-settings'
import { ChatScreen } from './components/chat'
import { SessionInsightsPage } from './pages/SessionInsightsPage'
import { SessionPerfComparisonPage } from './pages/SessionPerfComparisonPage'
import { useAuthStore } from './store'

function AppContent() {
  const location = useLocation()

  // Hide bottom navigation on fullscreen routes (chat and analytics)
  const hiddenBottomNavRoutes = ['/session/', '/chat']
  const hideBottomNav = hiddenBottomNavRoutes.some(route =>
    location.pathname.includes(route)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className={hideBottomNav ? '' : 'pb-16'}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/sessions" element={<SessionsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/how-to-use" element={<HowToUsePage />} />
          <Route path="/profile/connection-score" element={<ConnectionScorePage />} />
          <Route path="/profile/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/profile/terms" element={<TermsOfUsePage />} />
          <Route path="/profile/contact" element={<ContactUsPage />} />
          <Route path="/profile/language" element={<LanguagePage />} />
          <Route path="/profile/delete-account" element={<DeleteAccountPage />} />
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
    </div>
  )
}

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize authentication on app startup
    initializeAuth()
  }, [initializeAuth])

  return (
    <Router>
      <AuthGuard>
        <AppContent />
      </AuthGuard>
    </Router>
  )
}

export default App
