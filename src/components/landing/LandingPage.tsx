import { HeroSection } from './HeroSection'
import { ProductShowcase } from './ProductShowcase'
import { TrustIndicators } from './TrustIndicators'
import { Footer } from './Footer'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProductShowcase />
      <TrustIndicators />
      <Footer />
    </div>
  )
}
