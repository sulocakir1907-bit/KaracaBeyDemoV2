'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Send } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

type CategoryKey = 'velvet' | 'satin' | 'linen' | 'jacquard' | 'silk' | 'tablecloth'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  categoryKey: CategoryKey | null
}

const styledImages = [
  '/images/styled-curtain.jpg',
  '/images/styled-cushion.jpg',
  '/images/styled-tablecloth.jpg',
]

const categoryImages: Record<CategoryKey, { main: string; styled: string[] }> = {
  velvet: {
    main: '/images/fabric-velvet.jpg',
    styled: styledImages,
  },
  satin: {
    main: '/images/fabric-satin.jpg',
    styled: styledImages,
  },
  linen: {
    main: '/images/fabric-linen.jpg',
    styled: styledImages,
  },
  jacquard: {
    main: '/images/fabric-jacquard.jpg',
    styled: styledImages,
  },
  silk: {
    main: '/images/fabric-silk.jpg',
    styled: styledImages,
  },
  tablecloth: {
    main: '/images/fabric-table.jpg',
    styled: styledImages,
  },
}

const countries = ['Russia', 'Turkey', 'Germany', 'France', 'UAE', 'Kazakhstan', 'Other']

export function ProductModal({ isOpen, onClose, categoryKey }: ProductModalProps) {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { t, locale } = useLocale()

  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
    }
  }, [isOpen])

  if (!categoryKey) return null

  const category = t.collections.categories[categoryKey]
  const images = categoryImages[categoryKey]

  const handleWhatsApp = () => {
    const message = t.concierge.messageTemplate
      .replace('{product}', category.name)
      .replace('{country}', selectedCountry || 'my country')
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/905551234567?text=${encodedMessage}`, '_blank')
  }

  const handleTelegram = () => {
    const message = t.concierge.messageTemplate
      .replace('{product}', category.name)
      .replace('{country}', selectedCountry || 'my country')
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://t.me/karacabey?text=${encodedMessage}`, '_blank')
  }

  const styledLabels = [t.product.asCurtain, t.product.asCushion, t.product.asTablecloth]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-ivory overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-navy text-ivory rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto">
              {/* Left: Product Image */}
              <div className="lg:w-1/2 p-8 lg:p-12 bg-cream flex flex-col items-center justify-center min-h-[400px]">
                {/* Main Image */}
                <div className="relative w-full max-w-md aspect-square">
                  <div 
                    className="absolute inset-0 bg-cover bg-center rounded-lg shadow-xl"
                    style={{ backgroundImage: `url(${images.main})` }}
                  />
                  {/* Quality Seal */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-lg">
                    <div className="text-center text-navy">
                      <span className="block text-[8px] tracking-wider uppercase">Premium</span>
                      <span className="block text-xs font-serif font-semibold">Quality</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                {/* Category Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-gold border border-gold/30">
                    {categoryKey.toUpperCase()}
                  </span>
                  <div className="flex-1 h-[1px] bg-gold/20" />
                </div>

                {/* Title & Description */}
                <h2 className="font-serif text-3xl lg:text-4xl text-navy mb-3">
                  {category.name}
                </h2>
                <p className="text-navy/70 leading-relaxed mb-8">
                  {category.description}
                </p>

                {/* Styled For You Section */}
                <div className="mb-8">
                  <h3 className="font-serif text-lg text-navy mb-4 flex items-center gap-3">
                    <span className="gold-foil">{t.product.styledFor}</span>
                    <div className="flex-1 h-[1px] bg-gold/20" />
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {images.styled.map((img, idx) => (
                      <div key={idx} className="group relative aspect-[4/3] overflow-hidden cursor-pointer">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                        <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/60 transition-colors" />
                        <span className="absolute bottom-2 left-2 text-ivory text-xs tracking-wide">
                          {styledLabels[idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Selector */}
                <div className="mb-6">
                  <label className="block text-navy/60 text-sm mb-2">
                    {locale === 'ru' ? 'Ваша страна' : locale === 'tr' ? 'Ülkeniz' : 'Your Country'}
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 text-navy focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="">
                      {locale === 'ru' ? 'Выберите страну' : locale === 'tr' ? 'Ülke seçin' : 'Select country'}
                    </option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Contact Buttons */}
                <div className="mt-auto space-y-3">
                  <p className="text-navy/60 text-sm mb-3">{t.product.speakSpecialist}</p>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleWhatsApp}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-sans text-sm tracking-wide"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t.concierge.whatsapp}
                    </motion.button>
                    <motion.button
                      onClick={handleTelegram}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#0088cc] text-white font-sans text-sm tracking-wide"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-5 h-5" />
                      {t.concierge.telegram}
                    </motion.button>
                  </div>
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-navy text-ivory font-sans text-sm tracking-[0.15em] uppercase"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t.product.requestSample}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
