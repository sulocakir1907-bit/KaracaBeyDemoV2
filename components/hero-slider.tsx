'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { FloatingFabric } from './floating-fabric'

const slideImages = [
  '/images/hero-satin.jpg',
  '/images/hero-tablecloth.jpg',
  '/images/hero-velvet.jpg',
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useLocale()

  const slides = [
    { ...t.hero.slide1, image: slideImages[0] },
    { ...t.hero.slide2, image: slideImages[1] },
    { ...t.hero.slide3, image: slideImages[2] },
  ]

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy">
      {/* Floating Fabric Elements */}
      <FloatingFabric />

      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/30 to-navy/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/50 via-transparent to-navy/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Signature Mark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-block px-6 py-2 border border-gold/40 text-gold text-xs tracking-[0.3em] uppercase">
            Karaca Bey Signature
          </span>
        </motion.div>

        {/* Main Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-ivory mb-6 leading-tight text-balance">
              {slides[currentSlide].title}
            </h1>
            <p className="font-sans text-lg md:text-xl text-ivory/80 font-light tracking-wide max-w-2xl mx-auto text-pretty">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Button */}
        <motion.a
          href="#collections"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 group relative inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy font-sans text-sm tracking-[0.2em] uppercase overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">{t.hero.cta}</span>
          <motion.div
            className="absolute inset-0 bg-gold-light"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>

        {/* Slide Indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative w-12 h-[2px] transition-colors ${
                index === currentSlide ? 'bg-gold' : 'bg-ivory/30'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-gold"
                  layoutId="activeSlide"
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-ivory/60"
          >
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Side Text - Editorial Touch */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <div className="flex items-center gap-4 -rotate-90 origin-left">
          <div className="w-16 h-[1px] bg-gold/50" />
          <span className="text-ivory/50 text-xs tracking-[0.3em] uppercase whitespace-nowrap">
            Est. 2024 • Premium Textiles
          </span>
        </div>
      </motion.div>

      {/* Certified Quality Seal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute right-8 bottom-8 hidden lg:flex items-center gap-3"
      >
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center">
          <div className="text-center">
            <span className="block text-gold text-[8px] tracking-[0.2em] uppercase">Certified</span>
            <span className="block text-gold text-[10px] font-serif">Quality</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
