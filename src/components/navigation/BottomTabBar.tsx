import { NavLink, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid'
import { useAppStore } from '@/store'
import { useTranslation, type Translations } from '@/utils/translations'

interface TabItem {
  id: string
  path: string
  labelKey: keyof Translations['navigation']
  icon: React.ComponentType<{ className?: string }>
  iconActive: React.ComponentType<{ className?: string }>
}

const tabs: TabItem[] = [
  {
    id: 'home',
    path: '/',
    labelKey: 'home',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    id: 'search',
    path: '/search',
    labelKey: 'search',
    icon: MagnifyingGlassIcon,
    iconActive: MagnifyingGlassIconSolid,
  },
  {
    id: 'analytics',
    path: '/analytics',
    labelKey: 'progress',
    icon: ChartBarIcon,
    iconActive: ChartBarIconSolid,
  },
  {
    id: 'profile',
    path: '/profile',
    labelKey: 'profile',
    icon: UserIcon,
    iconActive: UserIconSolid,
  },
]

export const BottomTabBar = () => {
  const location = useLocation()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const isActive =
            location.pathname === tab.path ||
            (tab.path !== '/' && location.pathname.startsWith(tab.path))
          const Icon = isActive ? tab.iconActive : tab.icon
          const displayLabel = t.navigation[tab.labelKey]

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 
                transition-all duration-300 ease-out transform
                ${
                  isActive
                    ? 'text-blue-100 scale-105'
                    : 'text-gray-500 hover:text-gray-700 active:text-blue-100 hover:scale-102'
                }
              `}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              <span
                className={`text-xs font-medium truncate transition-all duration-300 ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}
              >
                {displayLabel}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
