import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

export const TrustIndicators = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <div className="px-6 py-12 bg-white">
      <div className="text-center mb-8">
        <p className="text-lg text-blue-100 font-semibold">
          {t.landing.userCount}
        </p>
      </div>

      {/* Mobile: Single column, Desktop: Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {t.landing.testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-blue-10 border border-blue-25 p-6 rounded-2xl"
          >
            <p className="text-base text-gray-700 italic mb-3 leading-relaxed">
              "{testimonial.text}"
            </p>
            <p className="text-sm font-semibold text-blue-100">
              {testimonial.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
