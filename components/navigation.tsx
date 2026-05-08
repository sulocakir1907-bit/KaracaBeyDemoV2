'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { type Locale, locales } from '@/lib/i18n'

const localeNames: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
  ru: 'RU',
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { locale, setLocale, t } = useLocale()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/showroom', label: 'Showroom', isLink: true },
    { href: '#collections', label: t.nav.collections },
    { href: '#heritage', label: t.nav.heritage },
    { href: '#atelier', label: t.nav.atelier },
    { href: '#contact', label: t.nav.contact },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <motion.a 
              href="#"
              className="relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-serif text-2xl lg:text-3xl font-semibold tracking-wide text-navy">
                Karaca Bey
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-12">
              {navItems.map((item) => (
                item.isLink ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative font-sans text-sm tracking-[0.2em] uppercase text-navy/80 hover:text-navy transition-colors group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                ) : (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="relative font-sans text-sm tracking-[0.2em] uppercase text-navy/80 hover:text-navy transition-colors group"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </motion.a>
                )
              ))}
            </div>

            {/* Language Selector & Mobile Menu Button */}
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="hidden sm:flex items-center gap-2">
                {locales.map((loc) => (
                  <motion.button
                    key={loc}
                    onClick={() => setLocale(loc)}
                    className={`text-xs tracking-[0.15em] uppercase px-3 py-1.5 rounded transition-all ${
                      locale === loc
                        ? 'bg-navy text-ivory'
                        : 'text-navy/60 hover:text-navy'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {localeNames[loc]}
                  </motion.button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-navy"
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Gold accent line */}
        <div className={`h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ivory"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Close Button */}
              <div className="flex justify-end p-6">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-navy"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Mobile Nav Items */}
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {navItems.map((item, index) => (
                  item.isLink ? (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-serif text-3xl text-navy"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="font-serif text-3xl text-navy"
                    >
                      {item.label}
                    </motion.a>
                  )
                ))}
              </div>

              {/* Mobile Language Selector */}
              <div className="flex justify-center gap-4 pb-12">
                {locales.map((loc) => (
                  <motion.button
                    key={loc}
                    onClick={() => setLocale(loc)}
                    className={`text-sm tracking-[0.15em] uppercase px-4 py-2 rounded transition-all ${
                      locale === loc
                        ? 'bg-navy text-ivory'
                        : 'text-navy/60 hover:text-navy border border-navy/20'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {localeNames[loc]}
                  </motion.button>
                ))}
              </div>

              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
