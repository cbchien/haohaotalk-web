import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  BookOpenIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    id: 'search',
    title: 'Find Scenarios',
    description: 'Browse all conversation topics',
    icon: MagnifyingGlassIcon,
    color: 'blue',
    path: '/search',
  },
  {
    id: 'progress',
    title: 'View Progress',
    description: 'Track your improvement',
    icon: ChartBarIcon,
    color: 'green',
    path: '/analytics',
  },
  {
    id: 'random',
    title: 'Random Practice',
    description: 'Surprise me with a scenario',
    icon: SparklesIcon,
    color: 'yellow',
  },
  {
    id: 'tips',
    title: 'Conversation Tips',
    description: 'Learn communication skills',
    icon: BookOpenIcon,
    color: 'pink',
  },
]

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-10 text-blue-100 border-blue-25'
    case 'green':
      return 'bg-green-10 text-green-100 border-green-25'
    case 'yellow':
      return 'bg-yellow-10 text-yellow-100 border-yellow-25'
    case 'pink':
      return 'bg-pink-10 text-pink-100 border-pink-25'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export const QuickActions = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map(action => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              className={`p-4 rounded-2xl border-2 text-left transition-smooth hover-scale-lg active:scale-95 tap-highlight ${getColorClasses(action.color)}`}
            >
              <Icon className="w-6 h-6 mb-3" />
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs opacity-80">{action.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
