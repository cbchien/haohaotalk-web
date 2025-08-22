import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ChatSession } from './types'
import type { Scenario, ScenarioRole } from '@/services'

interface AppState {
  // UI State
  currentLanguage: 'en' | 'zh'
  isOffline: boolean

  // Scenarios
  scenarios: Scenario[]
  popularScenarios: Scenario[]
  featuredScenarios: Scenario[]
  isLoadingScenarios: boolean

  // Current Session
  activeSession: ChatSession | null
  isLoadingSession: boolean

  // Session Configuration (for chat setup)
  currentScenario: Scenario | null
  availableRoles: ScenarioRole[]
  selectedRole: ScenarioRole | null
  relationshipLevel: 'low' | 'normal' | 'high'

  // Search & Filters
  searchQuery: string
  selectedCategories: string[]
  selectedDifficulty: string[]

  // Actions
  setLanguage: (language: 'en' | 'zh') => void
  setOfflineStatus: (isOffline: boolean) => void
  setScenarios: (scenarios: Scenario[]) => void
  setPopularScenarios: (scenarios: Scenario[]) => void
  setFeaturedScenarios: (scenarios: Scenario[]) => void
  setScenariosLoading: (loading: boolean) => void
  setActiveSession: (session: ChatSession | null) => void
  setSessionLoading: (loading: boolean) => void
  setCurrentScenario: (scenario: Scenario | null) => void
  setAvailableRoles: (roles: ScenarioRole[]) => void
  setSelectedRole: (role: ScenarioRole | null) => void
  setRelationshipLevel: (level: 'low' | 'normal' | 'high') => void
  clearSessionConfiguration: () => void
  setSessionConfiguration: (
    scenario: Scenario,
    roles: ScenarioRole[],
    role: ScenarioRole,
    relationshipLevel: 'low' | 'normal' | 'high'
  ) => void
  setSearchQuery: (query: string) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedDifficulty: (difficulty: string[]) => void
  clearFilters: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    set => ({
      // Initial state
      currentLanguage: 'zh',
      isOffline: false,
      scenarios: [],
      popularScenarios: [],
      featuredScenarios: [],
      isLoadingScenarios: false,
      activeSession: null,
      isLoadingSession: false,
      currentScenario: null,
      availableRoles: [],
      selectedRole: null,
      relationshipLevel: 'normal',
      searchQuery: '',
      selectedCategories: [],
      selectedDifficulty: [],

      // Actions
      setLanguage: language => set({ currentLanguage: language }),
      setOfflineStatus: isOffline => set({ isOffline }),
      setScenarios: scenarios => set({ scenarios }),
      setPopularScenarios: scenarios => set({ popularScenarios: scenarios }),
      setFeaturedScenarios: scenarios => set({ featuredScenarios: scenarios }),
      setScenariosLoading: loading => set({ isLoadingScenarios: loading }),
      setActiveSession: session => set({ activeSession: session }),
      setSessionLoading: loading => set({ isLoadingSession: loading }),
      setCurrentScenario: scenario => set({ currentScenario: scenario }),
      setAvailableRoles: roles => set({ availableRoles: roles }),
      setSelectedRole: role => set({ selectedRole: role }),
      setRelationshipLevel: level => set({ relationshipLevel: level }),
      clearSessionConfiguration: () =>
        set({
          currentScenario: null,
          availableRoles: [],
          selectedRole: null,
          relationshipLevel: 'normal',
        }),
      setSessionConfiguration: (scenario, roles, role, relationshipLevel) =>
        set({
          currentScenario: scenario,
          availableRoles: roles,
          selectedRole: role,
          relationshipLevel,
        }),
      setSearchQuery: query => set({ searchQuery: query }),
      setSelectedCategories: categories =>
        set({ selectedCategories: categories }),
      setSelectedDifficulty: difficulty =>
        set({ selectedDifficulty: difficulty }),
      clearFilters: () =>
        set({
          searchQuery: '',
          selectedCategories: [],
          selectedDifficulty: [],
        }),
    }),
    {
      name: 'AppStore',
    }
  )
)
