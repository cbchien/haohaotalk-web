import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import { AuthModal } from './AuthModal'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export const AuthGuard = ({ children, requireAuth = false }: AuthGuardProps) => {
  const { user, isAuthenticated, setLoading } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Check if we need to show authentication
    if (requireAuth && !isAuthenticated) {
      setShowAuthModal(true)
    }
    
    // Initialize auth check (simulate checking stored token)
    if (!user) {
      setLoading(false)
    }
  }, [requireAuth, isAuthenticated, user, setLoading])

  // For now, show auth modal on app start if no user
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && !showAuthModal) {
        setShowAuthModal(true)
      }
    }, 1000) // Brief delay to show the app loading

    return () => clearTimeout(timer)
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