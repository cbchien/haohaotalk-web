import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { AuthModal } from './AuthModal'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export const AuthGuard = ({
  children,
  requireAuth = false,
}: AuthGuardProps) => {
  const location = useLocation()
  const { user, isAuthenticated, setLoading, showAuthModal, setShowAuthModal } =
    useAuthStore()
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    // Check if we need to show authentication
    if (requireAuth && !isAuthenticated) {
      setShowAuthModal(true)
    } else if (isAuthenticated) {
      // Close modal when user becomes authenticated
      setShowAuthModal(false)
    }

    // Initialize auth check (simulate checking stored token)
    if (!user) {
      setLoading(false)
    }
  }, [requireAuth, isAuthenticated, user, setLoading, setShowAuthModal])

  // Show auth modal on app start if no user, hide when authenticated
  // Skip auto auth modal on landing page
  useEffect(() => {
    if (user) {
      // User is authenticated, make sure modal is closed
      setShowAuthModal(false)
    } else if (!isLandingPage) {
      // No user and not on landing page, show modal after brief delay
      const timer = setTimeout(() => {
        if (!user && !showAuthModal) {
          setShowAuthModal(true)
        }
      }, 1000) // Brief delay to show the app loading

      return () => clearTimeout(timer)
    }
  }, [user, showAuthModal, isLandingPage, setShowAuthModal])

  return (
    <>
      {children}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
