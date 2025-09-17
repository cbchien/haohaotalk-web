import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ChatSession } from './types'
import type { Scenario, ScenarioRole, ScenarioTip } from '@/services'
import { getDefaultLanguage } from '@/utils/browserLanguage'
import type { OnboardingState } from '@/types/onboarding'

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

  // Onboarding
  onboarding: OnboardingState

  // Tips
  scenarioTips: Record<string, ScenarioTip[]>
  isLoadingTips: boolean

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

  // Onboarding actions
  showOnboarding: () => void
  hideOnboarding: () => void
  setOnboardingStep: (step: number) => void
  completeOnboarding: () => void

  // Tips actions
  setScenarioTips: (scenarioId: string, tips: ScenarioTip[]) => void
  setTipsLoading: (loading: boolean) => void
  getScenarioTips: (scenarioId: string) => ScenarioTip[] | undefined
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      set => ({
        // Initial state - use browser language as default
        currentLanguage: getDefaultLanguage(),
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
        onboarding: {
          isVisible: false,
          currentStep: 0,
          hasCompletedOnboarding: false,
        },
        scenarioTips: {},
        isLoadingTips: false,

        // Actions
        setLanguage: language => set({ currentLanguage: language }),
        setOfflineStatus: isOffline => set({ isOffline }),
        setScenarios: scenarios => set({ scenarios }),
        setPopularScenarios: scenarios => set({ popularScenarios: scenarios }),
        setFeaturedScenarios: scenarios =>
          set({ featuredScenarios: scenarios }),
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

        // Onboarding actions
        showOnboarding: () =>
          set(state => ({
            onboarding: { ...state.onboarding, isVisible: true },
          })),
        hideOnboarding: () =>
          set(state => ({
            onboarding: { ...state.onboarding, isVisible: false },
          })),
        setOnboardingStep: (step: number) =>
          set(state => ({
            onboarding: { ...state.onboarding, currentStep: step },
          })),
        completeOnboarding: () =>
          set(state => ({
            onboarding: {
              ...state.onboarding,
              isVisible: false,
              hasCompletedOnboarding: true,
            },
          })),

        // Tips actions
        setScenarioTips: (scenarioId, tips) =>
          set(state => ({
            scenarioTips: {
              ...state.scenarioTips,
              [scenarioId]: tips,
            },
          })),
        setTipsLoading: loading => set({ isLoadingTips: loading }),
        getScenarioTips: (scenarioId: string): ScenarioTip[] | undefined => {
          const state = useAppStore.getState()
          return state.scenarioTips[scenarioId]
        },
      }),
      {
        name: 'haohaotalk-app',
        partialize: state => ({
          // Only persist language setting and onboarding completion
          currentLanguage: state.currentLanguage,
          onboarding: {
            isVisible: false, // Never persist modal visibility
            currentStep: 0, // Always start from step 0
            hasCompletedOnboarding: state.onboarding.hasCompletedOnboarding,
          },
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
)
