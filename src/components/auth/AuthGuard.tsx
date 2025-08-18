import { useEffect, useState } from 'react'
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
  const { user, isAuthenticated, setLoading } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

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
  }, [requireAuth, isAuthenticated, user, setLoading])

  // Show auth modal on app start if no user, hide when authenticated
  useEffect(() => {
    if (user) {
      // User is authenticated, make sure modal is closed
      setShowAuthModal(false)
    } else {
      // No user, show modal after brief delay
      const timer = setTimeout(() => {
        if (!user && !showAuthModal) {
          setShowAuthModal(true)
        }
      }, 1000) // Brief delay to show the app loading

      return () => clearTimeout(timer)
    }
  }, [user, showAuthModal])

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
