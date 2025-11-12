import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'

const productImages = [
  {
    url: 'https://res.cloudinary.com/haohaotalk/image/upload/v1762942594/landing-page/hao-hao-talkArtboard_11_k22vxe.png',
    alt: 'Practice scenarios',
  },
  {
    url: 'https://res.cloudinary.com/haohaotalk/image/upload/v1762942582/landing-page/hao-hao-talkArtboard_11_2_kiet4q.png',
    alt: 'Real-time feedback',
  },
  {
    url: 'https://res.cloudinary.com/haohaotalk/image/upload/v1762942575/landing-page/hao-hao-talkArtboard_11_1_n1km6g.png',
    alt: 'Conversation practice',
  },
  {
    url: 'https://res.cloudinary.com/haohaotalk/image/upload/v1762942588/landing-page/hao-hao-talkArtboard_11_3_xbbide.png',
    alt: 'Progress tracking',
  },
  {
    url: 'https://res.cloudinary.com/haohaotalk/image/upload/v1762942591/landing-page/hao-hao-talkArtboard_11_4_hdyat1.png',
    alt: 'Performance insights',
  },
  {
    url: 'https://res.cloudinary.com/haohaotalk/image/upload/v1762942592/landing-page/hao-hao-talkArtboard_11_5_upy5s2.png',
    alt: 'Skill improvement',
  },
]

export const ProductShowcase = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % productImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + productImages.length) % productImages.length
    )
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % productImages.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.landing.showcase.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.landing.showcase.subtitle}
          </p>
        </div>

        {/* Image Carousel */}
        <div className="relative">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="aspect-[16/10] relative">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-100 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {t.landing.showcase.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-75 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-white text-2xl font-bold">{index + 1}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
