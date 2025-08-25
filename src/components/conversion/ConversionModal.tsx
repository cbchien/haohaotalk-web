import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore, useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ConversionBenefits } from './ConversionBenefits'
import { ConversionEmailForm } from './ConversionEmailForm'
import { ConversionGoogleButton } from './ConversionGoogleButton'

interface ConversionModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?:
    | 'post-session'
    | 'profile-access'
    | 'scenario-browsing'
    | 'session-milestone'
  sessionData?: {
    session?: unknown
    finalScore?: number
    scorePercentage?: number
  } // For post-session context
}

type ConversionStep = 'benefits' | 'conversion'
type ConversionMethod = 'email' | 'google' | null

export const ConversionModal = ({
  isOpen,
  onClose,
  trigger = 'scenario-browsing',
}: ConversionModalProps) => {
  const [step, setStep] = useState<ConversionStep>('benefits')
  const [method, setMethod] = useState<ConversionMethod>(null)
  const { user, isConverting, conversionError } = useAuthStore()
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const handleMethodSelect = (selectedMethod: ConversionMethod) => {
    setMethod(selectedMethod)
    setStep('conversion')
  }

  const handleBack = () => {
    setStep('benefits')
    setMethod(null)
  }

  const handleSuccess = () => {
    onClose()
    // Reset state for next time
    setTimeout(() => {
      setStep('benefits')
      setMethod(null)
    }, 300)
  }

  if (!isOpen || !user?.isGuest) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {step === 'conversion' && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'benefits'
                ? t.conversion.secureYourProgress
                : method === 'email'
                  ? t.conversion.createAccount
                  : t.conversion.continueWithGoogle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {step === 'benefits' ? (
          <ConversionBenefits
            trigger={trigger}
            onEmailSelect={() => handleMethodSelect('email')}
            onGoogleSelect={() => handleMethodSelect('google')}
          />
        ) : method === 'email' ? (
          <ConversionEmailForm
            onSuccess={handleSuccess}
            error={conversionError}
            isLoading={isConverting}
          />
        ) : method === 'google' ? (
          <div className="space-y-4">
            <ConversionGoogleButton
              onSuccess={handleSuccess}
              error={conversionError}
              isLoading={isConverting}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
