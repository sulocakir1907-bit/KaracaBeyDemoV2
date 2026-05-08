'use client'

import { motion } from 'framer-motion'
import { useLocale } from '@/lib/locale-context'

export function Footer() {
  const { t } = useLocale()
  
  const currentYear = new Date().getFullYear()

  const collections = [
    { name: 'Velvet', href: '#collections' },
    { name: '3D Satin', href: '#collections' },
    { name: 'Premium Linen', href: '#collections' },
    { name: 'Jacquard', href: '#collections' },
    { name: 'Silk Blend', href: '#collections' },
    { name: 'Table Linens', href: '#collections' },
  ]

  const company = [
    { name: t.footer.aboutUs, href: '#heritage' },
    { name: t.footer.ourStory, href: '#heritage' },
    { name: t.footer.careers, href: '#' },
  ]

  const support = [
    { name: t.footer.faq, href: '#' },
    { name: t.footer.shipping, href: '#' },
    { name: t.footer.returns, href: '#' },
  ]

  return (
    <footer id="contact" className="bg-navy pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-gold/20">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.a 
              href="#"
              className="inline-block mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-serif text-3xl text-ivory">Karaca Bey</span>
            </motion.a>
            <p className="text-ivory/60 text-sm leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            
            {/* Signature Seal */}
            <div className="inline-flex items-center gap-3 px-4 py-3 border border-gold/20">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center">
                <span className="gold-foil text-sm font-serif font-bold">KB</span>
              </div>
              <div>
                <span className="block text-ivory text-xs">Est. 1998</span>
                <span className="block text-gold text-[10px] tracking-wider uppercase">Premium Textiles</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-lg text-ivory mb-6">{t.footer.collections}</h4>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-ivory/60 text-sm hover:text-gold transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg text-ivory mb-6">{t.footer.company}</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-ivory/60 text-sm hover:text-gold transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif text-lg text-ivory mb-6">{t.footer.support}</h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-ivory/60 text-sm hover:text-gold transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className="text-ivory text-sm mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 bg-navy-light border border-gold/20 text-ivory text-sm placeholder:text-ivory/40 focus:outline-none focus:border-gold"
                />
                <motion.button
                  className="px-4 py-2 bg-gold text-navy text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Row */}
        <div className="py-8 border-b border-gold/20 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-ivory/40 text-xs">
            <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-[8px]">✓</span>
            </div>
            <span>Premium Textile Certified</span>
          </div>
          <div className="flex items-center gap-2 text-ivory/40 text-xs">
            <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-[8px]">✓</span>
            </div>
            <span>Global Shipping Partners</span>
          </div>
          <div className="flex items-center gap-2 text-ivory/40 text-xs">
            <div className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-[8px]">✓</span>
            </div>
            <span>Secure Payment</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ivory/40 text-xs">
            © {currentYear} Karaca Bey. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6 text-ivory/40 text-xs">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Large Decorative Text */}
        <div className="mt-16 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <span className="font-serif text-[8vw] md:text-[6vw] text-ivory/[0.03] leading-none whitespace-nowrap">
              Karaca Bey
            </span>
          </motion.div>
        </div>
      </div>

      {/* Top Gold Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </footer>
  )
}
