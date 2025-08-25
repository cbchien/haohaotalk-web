import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store'
import { ConversionModal } from '@/components/conversion'

interface ProfilePageLayoutProps {
  title: string
  children: React.ReactNode
}

export const ProfilePageLayout = ({
  title,
  children,
}: ProfilePageLayoutProps) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [showConversionModal, setShowConversionModal] = useState(false)

  useEffect(() => {
    // Show conversion modal for guest users accessing profile pages
    if (user?.isGuest) {
      setShowConversionModal(true)
    }
  }, [user?.isGuest])

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center p-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors mr-3"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>

      {/* Conversion Modal for profile page access */}
      <ConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        trigger="profile-access"
      />
    </>
  )
}
