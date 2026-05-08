'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, Send, Phone, Mail } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

export function ConciergeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { t, locale } = useLocale()

  const handleWhatsApp = () => {
    const message = locale === 'ru' 
      ? 'Здравствуйте Karaca Bey, я хотел бы обсудить индивидуальный заказ.'
      : locale === 'tr'
      ? 'Merhaba Karaca Bey, özel bir sipariş hakkında görüşmek istiyorum.'
      : 'Hello Karaca Bey, I would like to discuss a custom order.'
    window.open(`https://wa.me/905551234567?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleTelegram = () => {
    const message = locale === 'ru'
      ? 'Здравствуйте Karaca Bey, я хотел бы обсудить индивидуальный заказ.'
      : locale === 'tr'
      ? 'Merhaba Karaca Bey, özel bir sipariş hakkında görüşmek istiyorum.'
      : 'Hello Karaca Bey, I would like to discuss a custom order.'
    window.open(`https://t.me/karacabey?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <section
      id="atelier"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-cream overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #0A1128 0px, #0A1128 1px, transparent 1px, transparent 40px)`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&q=90)' }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-8 -right-8 bg-ivory p-6 shadow-xl max-w-[280px] hidden md:block"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="gold-foil text-lg font-serif font-bold">KB</span>
                </div>
                <div>
                  <span className="block text-navy text-sm font-semibold">Personal Service</span>
                  <span className="block text-navy/60 text-xs">Available 24/7</span>
                </div>
              </div>
              <p className="text-navy/70 text-sm leading-relaxed">
                {locale === 'ru' 
                  ? 'Наши специалисты говорят на вашем языке'
                  : locale === 'tr'
                  ? 'Uzmanlarımız sizin dilinizi konuşuyor'
                  : 'Our specialists speak your language'}
              </p>
            </motion.div>

            {/* Corner Frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/40" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/40" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Decorative Element */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase">Exclusive Service</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-6 leading-tight">
              {t.concierge.title}
            </h2>
            <p className="font-sans text-lg text-navy/70 leading-relaxed mb-10">
              {t.concierge.subtitle}
            </p>

            {/* Contact Buttons */}
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              <motion.button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 bg-[#25D366] text-white group active:scale-[0.98]"
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left min-w-0">
                  <span className="block font-sans text-base md:text-lg">{t.concierge.whatsapp}</span>
                  <span className="block text-white/80 text-xs md:text-sm truncate">
                    {locale === 'ru' ? 'Мгновенный ответ' : locale === 'tr' ? 'Anında cevap' : 'Instant response'}
                  </span>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                  <Send className="w-5 h-5" />
                </div>
              </motion.button>

              <motion.button
                onClick={handleTelegram}
                className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 bg-[#0088cc] text-white group active:scale-[0.98]"
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left min-w-0">
                  <span className="block font-sans text-base md:text-lg">{t.concierge.telegram}</span>
                  <span className="block text-white/80 text-xs md:text-sm">@karacabey</span>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                  <Send className="w-5 h-5" />
                </div>
              </motion.button>
            </div>

            {/* Additional Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gold/20">
              <a href="tel:+905551234567" className="flex items-center gap-3 p-3 bg-cream/50 hover:bg-cream transition-colors">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-navy text-sm">+90 555 123 4567</span>
                  <span className="block text-navy/60 text-xs">Mon-Sat 9:00-21:00</span>
                </div>
              </a>
              <a href="mailto:contact@karacabey.com" className="flex items-center gap-3 p-3 bg-cream/50 hover:bg-cream transition-colors">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-navy text-sm truncate">contact@karacabey.com</span>
                  <span className="block text-navy/60 text-xs">24h response</span>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
