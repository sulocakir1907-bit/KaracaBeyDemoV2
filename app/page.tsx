'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Layers, Sparkles } from 'lucide-react'
import { LocaleProvider, useLocale } from '@/lib/locale-context'
import { SmoothScroll } from '@/components/smooth-scroll'
import { LoadingScreen } from '@/components/loading-screen'
import { Navigation } from '@/components/navigation'
import { HeroSlider } from '@/components/hero-slider'
import { CollectionsGallery } from '@/components/collections-gallery'
import { HeritageSection } from '@/components/heritage-section'
import { ConciergeSection } from '@/components/concierge-section'
import { Footer } from '@/components/footer'
import { FABRIC_DATA } from '@/lib/fabric-data'

// Showroom CTA Banner Component - Industrial Luxury Design
function ShowroomBanner() {
  const { locale, t } = useLocale()
  
  const bannerTexts = {
    label: { tr: 'Dijital Katalog', en: 'Digital Catalog', ru: 'Цифровой Каталог' },
    title: { tr: 'Akıllı Showroom', en: 'Smart Showroom', ru: 'Умный Шоурум' },
    description: { 
      tr: `${FABRIC_DATA.length}+ premium kumaşı detaylı teknik özellikler, yüksek çözünürlüklü doku büyütme ve anında teklif talebi ile inceleyin.`,
      en: `Browse ${FABRIC_DATA.length}+ premium fabrics with detailed technical specifications, high-fidelity texture magnification, and instant quote requests.`,
      ru: `Просмотрите ${FABRIC_DATA.length}+ премиальных тканей с детальными техническими характеристиками и мгновенными запросами цен.`
    },
    magnifier: { tr: 'Doku Büyüteci', en: 'Texture Magnifier', ru: 'Увеличитель Текстуры' },
    categories: { tr: '13+ Kategori', en: '13+ Categories', ru: '13+ Категорий' },
    quotes: { tr: 'Anında Teklif', en: 'Instant Quotes', ru: 'Мгновенные Цены' },
    cta: { tr: 'Showroom\'a Gir', en: 'Enter Showroom', ru: 'Войти в Шоурум' }
  }
  
  return (
    <section id="showroom" className="bg-slate-900 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="text-center md:text-left max-w-2xl">
            {/* Section Label */}
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-sans font-bold tracking-[0.25em] uppercase text-slate-400">
                {bannerTexts.label[locale]}
              </span>
            </div>
            
            {/* H2 - font-serif, font-bold, uppercase, tracking-widest */}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-widest text-white mb-4">
              {bannerTexts.title[locale]}
            </h2>
            
            {/* Description */}
            <p className="font-sans text-lg font-light text-slate-400 leading-relaxed">
              {bannerTexts.description[locale]}
            </p>
            
            {/* Feature highlights */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-sans font-light">
                <Sparkles className="w-3 h-3" />
                {bannerTexts.magnifier[locale]}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-sans font-light">
                {bannerTexts.categories[locale]}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-sans font-light">
                {bannerTexts.quotes[locale]}
              </span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Link
            href="/showroom"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-sans text-sm font-medium tracking-[0.15em] uppercase hover:bg-slate-100 transition-colors group flex-shrink-0"
          >
            {bannerTexts.cta[locale]}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <LocaleProvider>
      <LoadingScreen />
      <SmoothScroll />
      <main className="relative min-h-screen overflow-y-auto" style={{ position: 'relative' }}>
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
