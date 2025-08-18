import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthGuard } from './components/auth/AuthGuard'
import { BottomTabBar } from './components/navigation/BottomTabBar'
import { HomeScreen } from './screens/HomeScreen'
import { SearchScreen } from './screens/SearchScreen'
import { AnalyticsScreen } from './screens/AnalyticsScreen'
import { ProfileScreen } from './screens/ProfileScreen'

function App() {
  return (
    <Router>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          {/* Main Content */}
          <main className="pb-16">
            {' '}
            {/* Bottom padding for tab bar */}
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
          </main>

          {/* Bottom Navigation */}
          <BottomTabBar />
        </div>
      </AuthGuard>
    </Router>
  )
}

export default App
