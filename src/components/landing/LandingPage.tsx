import { HeroSection } from './HeroSection'
import { ProductShowcase } from './ProductShowcase'
import { TrustIndicators } from './TrustIndicators'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProductShowcase />
      <TrustIndicators />
    </div>
  )
}
