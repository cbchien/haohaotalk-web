import { create } from 'zustand'
import { Scenario, ChatSession } from './types'

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
  setSearchQuery: (query: string) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedDifficulty: (difficulty: string[]) => void
  clearFilters: () => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Initial state
  currentLanguage: 'en',
  isOffline: false,
  scenarios: [],
  popularScenarios: [],
  featuredScenarios: [],
  isLoadingScenarios: false,
  activeSession: null,
  isLoadingSession: false,
  searchQuery: '',
  selectedCategories: [],
  selectedDifficulty: [],

  // Actions
  setLanguage: (language) => set({ currentLanguage: language }),
  setOfflineStatus: (isOffline) => set({ isOffline }),
  setScenarios: (scenarios) => set({ scenarios }),
  setPopularScenarios: (scenarios) => set({ popularScenarios: scenarios }),
  setFeaturedScenarios: (scenarios) => set({ featuredScenarios: scenarios }),
  setScenariosLoading: (loading) => set({ isLoadingScenarios: loading }),
  setActiveSession: (session) => set({ activeSession: session }),
  setSessionLoading: (loading) => set({ isLoadingSession: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
  clearFilters: () => set({ 
    searchQuery: '', 
    selectedCategories: [], 
    selectedDifficulty: [] 
  }),
}))