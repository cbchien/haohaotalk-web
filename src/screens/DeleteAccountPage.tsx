import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useAppStore, useAuthStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { profileApiService } from '@/services'
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout'

export const DeleteAccountPage = () => {
  const navigate = useNavigate()
  const { currentLanguage } = useAppStore()
  const { user, logout } = useAuthStore()
  const t = useTranslation(currentLanguage)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      const response = await profileApiService.deleteAccount()

      if (response.success) {
        // Clear auth state and redirect to login
        await logout()
        navigate('/')
      } else {
        // Handle error
        alert(
          currentLanguage === 'zh'
            ? '刪除帳戶失敗，請稍後再試。'
            : 'Failed to delete account. Please try again later.'
        )
      }
    } catch {
      alert(
        currentLanguage === 'zh'
          ? '刪除帳戶時發生錯誤，請稍後再試。'
          : 'An error occurred while deleting your account. Please try again later.'
      )
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  return (
    <ProfilePageLayout title={t.profile.menu.deleteAccount}>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {!showConfirmation ? (
          <div>
            {/* Warning Header */}
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-lg font-semibold text-red-600">
                {currentLanguage === 'zh' ? '刪除帳戶' : 'Delete Account'}
              </h2>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 font-medium mb-2">
                {currentLanguage === 'zh'
                  ? '警告：此動作無法復原'
                  : 'Warning: This action cannot be undone'}
              </p>
              <p className="text-red-700 text-sm">
                {currentLanguage === 'zh'
                  ? '刪除帳戶後，您將永久失去所有資料和進度記錄。'
                  : 'Once you delete your account, you will permanently lose all your data and progress records.'}
              </p>
            </div>

            {/* What will be deleted */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                {currentLanguage === 'zh'
                  ? '將被刪除的資料：'
                  : 'Data that will be deleted:'}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                <li>
                  {currentLanguage === 'zh'
                    ? '個人資料和帳戶資訊'
                    : 'Personal information and account details'}
                </li>
                <li>
                  {currentLanguage === 'zh'
                    ? '所有練習對話記錄'
                    : 'All practice conversation records'}
                </li>
                <li>
                  {currentLanguage === 'zh'
                    ? '進度和統計資料'
                    : 'Progress and statistics data'}
                </li>
                <li>
                  {currentLanguage === 'zh'
                    ? '偏好設定'
                    : 'Preference settings'}
                </li>
              </ul>
            </div>

            {/* Alternative Options */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                {currentLanguage === 'zh'
                  ? '考慮其他選項：'
                  : 'Consider alternatives:'}
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm mb-2">
                  {currentLanguage === 'zh'
                    ? '如果您只是暫時不想使用服務，可以考慮登出而不刪除帳戶。'
                    : 'If you just want to temporarily stop using the service, consider logging out instead of deleting your account.'}
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {currentLanguage === 'zh'
                    ? '返回個人資料頁面'
                    : 'Return to Profile'}
                </button>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              {currentLanguage === 'zh'
                ? '我了解風險，繼續刪除'
                : 'I understand the risks, continue deletion'}
            </button>
          </div>
        ) : (
          <div>
            {/* Final Confirmation */}
            <div className="text-center mb-6">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-600 mb-2">
                {currentLanguage === 'zh' ? '最後確認' : 'Final Confirmation'}
              </h2>
              <p className="text-gray-600">
                {currentLanguage === 'zh'
                  ? '您確定要刪除帳戶嗎？此動作無法復原。'
                  : 'Are you sure you want to delete your account? This action cannot be undone.'}
              </p>
            </div>

            {/* Current User Info */}
            {user && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  {currentLanguage === 'zh'
                    ? '即將刪除的帳戶：'
                    : 'Account to be deleted:'}
                </p>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-600">{user.displayName}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting
                  ? currentLanguage === 'zh'
                    ? '刪除中...'
                    : 'Deleting...'
                  : currentLanguage === 'zh'
                    ? '確認刪除帳戶'
                    : 'Confirm Account Deletion'}
              </button>

              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isDeleting}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                {currentLanguage === 'zh' ? '取消' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ProfilePageLayout>
  )
}
