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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md mx-4 w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentStep + 1}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
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
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
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

        {/* Content */}
        <div className="p-6 text-center">
          {/* Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-10 to-blue-25 rounded-2xl flex items-center justify-center">
              <img
                src={currentIllustration}
                alt={currentStepContent.title}
                className="w-40 h-40 object-contain"
              />
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {currentStepContent.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {currentStepContent.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center space-x-2 px-2 py-2 rounded-xl transition-colors ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>{t.onboarding.previous}</span>
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
            className="flex items-center space-x-2 px-2 py-2 bg-blue-100 text-white rounded-xl hover:bg-blue-75 transition-colors whitespace-nowrap"
          >
            <span>
              {isLastStep ? t.onboarding.getStarted : t.onboarding.next}
            </span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
