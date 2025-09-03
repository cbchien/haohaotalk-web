export interface OnboardingState {
  isVisible: boolean
  currentStep: number
  hasCompletedOnboarding: boolean
}

export const onboardingIllustrations = [
  'https://res.cloudinary.com/haohaotalk/image/upload/v1756873767/onboarding/step-1-search.png',
  'https://res.cloudinary.com/haohaotalk/image/upload/v1756873767/onboarding/step-2-roles.png',
  'https://res.cloudinary.com/haohaotalk/image/upload/v1756873767/onboarding/step-3-chat.png',
  'https://res.cloudinary.com/haohaotalk/image/upload/v1756873767/onboarding/step-4-score.png',
  'https://res.cloudinary.com/haohaotalk/image/upload/v1756873767/onboarding/step-5-insights.png',
]

export const onboardingStepKeys = [
  'searchScenario',
  'pickRole',
  'startConversation',
  'connectionScore',
  'viewInsights',
] as const
