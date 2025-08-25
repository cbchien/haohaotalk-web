import { useState } from 'react'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { profileApiService } from '@/services'
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout'

export const ContactUsPage = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !body.trim()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await profileApiService.submitFeedback({
        subject: subject.trim(),
        body: body.trim(),
      })

      if (response.success) {
        setSubmitStatus('success')
        setSubject('')
        setBody('')
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProfilePageLayout title={t.profile.menu.contact}>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {currentLanguage === 'zh' ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              我們重視您的意見
            </h2>
            <p className="text-gray-600 text-sm">
              有任何問題、建議或回饋，請透過下方表單聯絡我們。我們會盡快回覆您。
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              We Value Your Feedback
            </h2>
            <p className="text-gray-600 text-sm">
              If you have any questions, suggestions, or feedback, please
              contact us using the form below. We'll get back to you as soon as
              possible.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'zh' ? '主題' : 'Subject'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={
                currentLanguage === 'zh'
                  ? '請輸入問題主題...'
                  : 'Enter subject...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'zh' ? '訊息內容' : 'Message'}
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={
                currentLanguage === 'zh'
                  ? '請詳細描述您的問題或建議...'
                  : 'Please describe your issue or suggestion in detail...'
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !body.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? currentLanguage === 'zh'
                ? '送出中...'
                : 'Submitting...'
              : currentLanguage === 'zh'
                ? '送出回饋'
                : 'Submit Feedback'}
          </button>
        </form>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 text-sm">
              {currentLanguage === 'zh'
                ? '感謝您的回饋！我們已收到您的訊息，會盡快回覆。'
                : 'Thank you for your feedback! We have received your message and will respond soon.'}
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">
              {currentLanguage === 'zh'
                ? '送出失敗，請稍後再試或檢查網路連線。'
                : 'Failed to submit. Please try again later or check your network connection.'}
            </p>
          </div>
        )}
      </div>
    </ProfilePageLayout>
  )
}
