'use client'

import Link from 'next/link'
import { LocaleProvider } from '@/lib/locale-context'
import { SmoothScroll } from '@/components/smooth-scroll'
import { LoadingScreen } from '@/components/loading-screen'
import { Navigation } from '@/components/navigation'
import { HeroSlider } from '@/components/hero-slider'
import { CollectionsGallery } from '@/components/collections-gallery'
import { HeritageSection } from '@/components/heritage-section'
import { ConciergeSection } from '@/components/concierge-section'
import { Footer } from '@/components/footer'
import { ArrowRight } from 'lucide-react'

// Showroom CTA Banner Component
function ShowroomBanner() {
  return (
    <section className="bg-slate-900 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-3 block">
              Digital Catalog
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
              Explore Our Fabric Showroom
            </h2>
            <p className="text-slate-400 max-w-xl">
              Browse 400+ premium fabrics with detailed technical specifications, 
              high-fidelity texture inspection, and instant quote requests.
            </p>
          </div>
          <Link
            href="/showroom"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 text-sm font-medium tracking-wider uppercase hover:bg-slate-100 transition-colors group"
          >
            Enter Showroom
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <LocaleProvider>
      <LoadingScreen />
      <SmoothScroll />
      <main className="relative">
        <Navigation />
        <HeroSlider />
        <ShowroomBanner />
        <CollectionsGallery />
        <HeritageSection />
        <ConciergeSection />
        <Footer />
      </main>
    </LocaleProvider>
  )
}
