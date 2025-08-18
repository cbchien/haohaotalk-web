import { useAuthStore } from '@/store'

export const WelcomeHeader = () => {
  const { user } = useAuthStore()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="bg-white p-6 pt-safe">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}{user?.display_name ? `, ${user.display_name}` : ''}!
          </h1>
          <p className="text-gray-600 mt-1">
            Ready to practice some conversations?
          </p>
        </div>
        
        {user?.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.display_name || 'User'} 
            className="w-12 h-12 rounded-full bg-blue-10 border-2 border-blue-25"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-10 border-2 border-blue-25 flex items-center justify-center">
            <span className="text-blue-100 font-semibold text-lg">
              {user?.display_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>

      {user?.account_type === 'guest' && (
        <div className="bg-yellow-10 border border-yellow-25 rounded-xl p-3">
          <p className="text-yellow-100 text-sm font-medium">
            You're using guest mode. Create an account to save your progress!
          </p>
        </div>
      )}
    </div>
  )
}