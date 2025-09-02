export interface OnboardingState {
  isVisible: boolean
  currentStep: number
  hasCompletedOnboarding: boolean
}

export const onboardingIllustrations = [
  '/images/onboarding/step-1-search.svg',
  '/images/onboarding/step-2-roles.svg',
  '/images/onboarding/step-3-chat.svg',
  '/images/onboarding/step-4-score.svg',
  '/images/onboarding/step-5-insights.svg',
]

export const onboardingStepKeys = [
  'searchScenario',
  'pickRole',
  'startConversation',
  'connectionScore',
  'viewInsights',
] as const
