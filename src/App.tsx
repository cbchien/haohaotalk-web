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
import { AnalyticsScreen } from './screens/AnalyticsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ChatSettingsScreen } from './components/chat-settings'
import { ChatScreen } from './components/chat'
import { useAuthStore } from './store'

function AppContent() {
  const location = useLocation()

  // Hide bottom navigation on chat routes (focused session)
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
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route
            path="/scenario/:scenarioId/configure"
            element={<ChatSettingsScreen />}
          />
          <Route path="/session/:sessionId/chat" element={<ChatScreen />} />
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
