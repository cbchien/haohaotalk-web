import { useAuthStore } from '@/store'

export const ProfileHeader = () => {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-16 h-16 rounded-full bg-blue-10 border-2 border-blue-25"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-10 border-2 border-blue-25 flex items-center justify-center">
            <span className="text-blue-100 font-semibold text-xl">
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {user.displayName}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  )
}
