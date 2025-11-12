import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

export const TrustIndicators = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Generate consistent colors for avatars based on index
  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-blue-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-pink-100',
      'bg-blue-75',
      'bg-green-75',
    ]
    return colors[index % colors.length]
  }

  // Extract initials from author name
  const getInitials = (author: string) => {
    const name = author.replace(/^-\s*/, '') // Remove leading "- "
    const names = name.split(' ')
    if (names.length >= 2) {
      return names[0][0] + names[1][0]
    }
    return name[0] || '?'
  }

  // Clean author name for display
  const getCleanAuthorName = (author: string) => {
    return author.replace(/^-\s*/, '')
  }

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
            <p className="text-base text-gray-700 italic mb-4 leading-relaxed">
              "{testimonial.text}"
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${getAvatarColor(index)} rounded-full flex items-center justify-center`}
              >
                <span className="text-white text-sm font-bold">
                  {getInitials(testimonial.author)}
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-100">
                {getCleanAuthorName(testimonial.author)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
