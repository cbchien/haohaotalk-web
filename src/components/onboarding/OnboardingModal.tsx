import { useState } from 'react'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { onboardingIllustrations, onboardingStepKeys } from '@/types/onboarding'

interface OnboardingModalProps {
  isVisible: boolean
  onComplete: () => void
  onSkip: () => void
}

export const OnboardingModal = ({
  isVisible,
  onComplete,
  onSkip,
}: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const currentStepKey = onboardingStepKeys[currentStep]
  const currentStepContent = t.onboarding.steps[currentStepKey]
  const currentIllustration = onboardingIllustrations[currentStep]

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === onboardingStepKeys.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-safe pb-safe">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentStep + 1}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                {t.onboarding.tutorial}
              </h2>
              <p className="text-xs text-gray-500">
                {t.onboarding.step} {currentStep + 1} {t.onboarding.of}{' '}
                {onboardingStepKeys.length}
              </p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="w-8 h-8 flex items-center justify-center rounded-full hover-bg-gray transition-smooth tap-highlight"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-100 to-blue-75 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / onboardingStepKeys.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-center">
          {/* Illustration */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-10 to-blue-25 rounded-2xl flex items-center justify-center">
              <img
                src={currentIllustration}
                alt={currentStepContent.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
            {currentStepContent.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {currentStepContent.description}
          </p>
        </div>

        {/* Footer - Flexible for mobile */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 gap-3">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 py-2 rounded-xl transition-smooth tap-highlight ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover-bg-gray'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="text-sm sm:text-base">{t.onboarding.previous}</span>
          </button>

          <div className="flex space-x-2">
            {onboardingStepKeys.map((_, index: number) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-100' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 bg-blue-100 text-white rounded-xl hover-bg-blue transition-smooth whitespace-nowrap tap-highlight"
          >
            <span className="text-sm sm:text-base">
              {isLastStep ? t.onboarding.getStarted : t.onboarding.next}
            </span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
