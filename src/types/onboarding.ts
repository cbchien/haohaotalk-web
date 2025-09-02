export interface OnboardingState {
  isVisible: boolean
  currentStep: number
  hasCompletedOnboarding: boolean
}

export const onboardingIllustrations = [
  '/images/onboarding/step-1-search.png',
  '/images/onboarding/step-2-roles.png',
  '/images/onboarding/step-3-chat.png',
  '/images/onboarding/step-4-score.png',
  '/images/onboarding/step-5-insights.png',
]

export const onboardingStepKeys = [
  'searchScenario',
  'pickRole',
  'startConversation',
  'connectionScore',
  'viewInsights',
] as const
