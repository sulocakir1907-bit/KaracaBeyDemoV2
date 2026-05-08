'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Globe, Award, History } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const heritageStats = [
  { value: '25+', label: 'Years of Excellence' },
  { value: '40+', label: 'Countries Served' },
  { value: '500+', label: 'Premium Clients' },
]

export function HeritageSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  
  const { t } = useLocale()

  const features = [
    {
      icon: Globe,
      title: t.heritage.logistics.title,
      description: t.heritage.logistics.description,
    },
    {
      icon: Award,
      title: t.heritage.quality.title,
      description: t.heritage.quality.description,
    },
    {
      icon: History,
      title: t.heritage.legacy.title,
      description: t.heritage.legacy.description,
    },
  ]

  return (
    <section
      id="heritage"
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-navy overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, #B89B5E 0px, #B89B5E 1px, transparent 1px, transparent 100px),
                            repeating-linear-gradient(0deg, #B89B5E 0px, #B89B5E 1px, transparent 1px, transparent 100px)`,
        }} />
      </div>

      {/* Parallax Background Image */}
      <motion.div
        style={{ y, opacity }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] hidden lg:block"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=1600&fit=crop&q=85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-navy" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-20"
        >
          {/* Decorative Element */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Since 1998</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory mb-6 leading-tight">
            {t.heritage.title}
          </h2>
          <p className="font-sans text-lg text-ivory/70 leading-relaxed">
            {t.heritage.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                  <feature.icon className="w-7 h-7 text-gold" />
                </div>
                {/* Corner accents */}
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-gold/50" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-gold/50" />
              </div>

              <h3 className="font-serif text-xl text-ivory mb-3 group-hover:text-gold transition-colors duration-500">
                {feature.title}
              </h3>
              <p className="font-sans text-ivory/60 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover line */}
              <div className="mt-4 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 py-12 border-t border-b border-gold/20"
        >
          {heritageStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="block font-serif text-3xl md:text-5xl gold-foil mb-2"
              >
                {stat.value}
              </motion.span>
              <span className="font-sans text-xs md:text-sm text-ivory/60 tracking-[0.15em] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          {/* Premium Textile Certified */}
          <div className="flex items-center gap-3 px-6 py-4 border border-gold/20">
            <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
              <Award className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="block text-ivory text-sm font-semibold">Premium Textile</span>
              <span className="block text-gold text-xs tracking-wider uppercase">Certified</span>
            </div>
          </div>

          {/* Global Shipping Partners */}
          <div className="flex items-center gap-3 px-6 py-4 border border-gold/20">
            <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
              <Globe className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="block text-ivory text-sm font-semibold">Global Shipping</span>
              <span className="block text-gold text-xs tracking-wider uppercase">Partners</span>
            </div>
          </div>

          {/* Karaca Bey Signature */}
          <div className="flex items-center gap-3 px-6 py-4 border border-gold/20">
            <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
              <span className="gold-foil text-lg font-serif font-bold">KB</span>
            </div>
            <div>
              <span className="block text-ivory text-sm font-semibold">Karaca Bey</span>
              <span className="block text-gold text-xs tracking-wider uppercase">Signature</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Side Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
      <div className="absolute right-0 top-1/3 w-[1px] h-1/3 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
    </section>
  )
}
