import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useAppStore } from '@/store'

export const UserTestingPage = () => {
  const navigate = useNavigate()
  const { currentLanguage } = useAppStore()

  const handleGetStarted = () => {
    // Direct all users to sign up/auth page
    navigate('/auth')
  }

  const steps = [
    {
      number: 1,
      title:
        currentLanguage === 'zh'
          ? '註冊帳號並開啟練習'
          : 'Sign Up & Explore App',
      description:
        currentLanguage === 'zh'
          ? '註冊帳戶並花幾分鐘探索「好好說」的功能，以及嘗試一些對話練習。'
          : 'Sign up for an account and spend a few minutes exploring HaoHaoTalk. Try some conversation scenarios!',
      duration: currentLanguage === 'zh' ? '~5 分鐘' : '~5 minutes',
      icon: CheckCircleIcon,
      completed: false,
    },
    {
      number: 2,
      title:
        currentLanguage === 'zh' ? '完成回饋表單' : 'Complete Feedback Form',
      description:
        currentLanguage === 'zh'
          ? '分享您的體驗和想法，幫助一起改善「好好說」的體驗。'
          : 'Share your experience and thoughts to help us improve the app.',
      duration: currentLanguage === 'zh' ? '~2 分鐘' : '~2 minutes',
      icon: ClockIcon,
      completed: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-relaxed">
              {currentLanguage === 'zh'
                ? '歡迎參與「好好說」的公開測試！'
                : 'Welcome to HaoHaoTalk Private Beta!'}
            </h1>
            <p className="text-lg text-gray-600">
              {currentLanguage === 'zh'
                ? '一同打造更好的對話練習體驗'
                : 'Help us build a better conversation practice experience'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentLanguage === 'zh' ? '測試說明' : 'Testing Instructions'}
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              {currentLanguage === 'zh'
                ? '感謝參與我們的公開測試！你的寶貴意見能協助讓「好好說」有更好的體驗。'
                : 'Thank you for joining our private beta! We value your feedback to improve HaoHaoTalk.'}
            </p>
            <p>
              {currentLanguage === 'zh'
                ? '整個過程大約需要7分鐘，完成後您將有機會一起參與抽獎活動！'
                : "The entire process takes about 7 minutes, and you'll have a chance to win prizes!"}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map(step => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-200 bg-blue-50 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.number}. {step.title}
                    </h3>
                    <div className="mb-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      {step.description}
                    </p>

                    {/* Step Action Button */}
                    {step.number === 1 && (
                      <button
                        onClick={handleGetStarted}
                        className="inline-flex items-center px-6 py-2 bg-blue-100 text-white font-medium rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {currentLanguage === 'zh' ? '開始測試' : 'Get Started'}
                      </button>
                    )}

                    {step.number === 2 && (
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfxJPMqVtQ5lWEpeti9g8HR8RcKgMdmye1kF5oNSHGvspTy-w/viewform?usp=header"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 bg-blue-100 text-white font-medium rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {currentLanguage === 'zh'
                          ? '填寫回饋單'
                          : 'Complete Form'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ending Message */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentLanguage === 'zh' ? '參加抽獎' : 'Prize Draw'}
          </h2>
          <div className="text-gray-600">
            <p className="mb-3">
              {currentLanguage === 'zh'
                ? '完成以上兩個步驟，即可自動參加抽獎活動。感謝您的參與和寶貴的建議！'
                : 'Complete both steps above to be automatically entered into our prize draw! Thank you for your participation and valuable feedback!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
