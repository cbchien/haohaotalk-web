import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ProfileHeader } from '@/pages/profile/components/ProfileHeader'
import { ProfileMenuItem } from '@/pages/profile/components/ProfileMenuItem'
import { ConversionModal } from '@/components/conversion'

export const ProfileScreen = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [showConversionModal, setShowConversionModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Show conversion modal for guest users accessing profile
    if (user?.isGuest) {
      setShowConversionModal(true)
    }
  }, [user?.isGuest])

  const handleLogout = async () => {
    await logout()
  }

  const menuItems = [
    {
      title: t.profile.menu.howToUse,
      onClick: () => navigate('/profile/how-to-use'),
    },
    {
      title: t.profile.menu.connectionScore,
      onClick: () => navigate('/profile/connection-score'),
    },
    {
      title: t.profile.menu.privacy,
      onClick: () => navigate('/profile/privacy'),
    },
    {
      title: t.profile.menu.terms,
      onClick: () => navigate('/profile/terms'),
    },
    {
      title: t.profile.menu.contact,
      onClick: () => navigate('/profile/contact'),
    },
    {
      title: t.profile.menu.language,
      onClick: () => navigate('/profile/language'),
    },
    {
      title: t.profile.menu.deleteAccount,
      onClick: () => navigate('/profile/delete-account'),
      variant: 'danger' as const,
    },
    {
      title: t.profile.menu.logout,
      onClick: handleLogout,
      variant: 'danger' as const,
      showArrow: false,
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <ProfileHeader />

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <div key={item.title}>
                <ProfileMenuItem
                  title={item.title}
                  onClick={item.onClick}
                  variant={item.variant}
                  showArrow={item.showArrow}
                />
                {index < menuItems.length - 1 && (
                  <div className="border-b border-gray-100 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Modal for profile access */}
      <ConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        trigger="profile-access"
      />
    </>
  )
}
