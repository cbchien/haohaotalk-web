import { useAuthStore } from '@/store'

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        {user && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="w-16 h-16 rounded-full bg-blue-10 border-2 border-blue-25"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-10 border-2 border-blue-25 flex items-center justify-center">
                  <span className="text-blue-100 font-semibold text-xl">
                    {user.display_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.display_name}
                </h2>
                {user.email && (
                  <p className="text-gray-600 text-sm">{user.email}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {user.account_type === 'guest' ? 'Guest Account' : 'Registered Account'}
                </p>
              </div>
            </div>
            
            {user.account_type === 'guest' && (
              <div className="bg-yellow-10 border border-yellow-25 rounded-xl p-3 mb-4">
                <p className="text-yellow-100 text-sm font-medium">
                  You're using guest mode. Create an account to save your progress!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            {user?.account_type === 'guest' ? 'Start Fresh Session' : 'Logout'}
          </button>
          
          {user?.account_type === 'guest' && (
            <p className="text-gray-500 text-xs mt-2 text-center">
              This will clear your current session and start over
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
