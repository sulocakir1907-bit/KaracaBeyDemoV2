'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { type Locale, locales } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Turkce',
  ru: 'Russkiy',
}

const localeShort: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
  ru: 'RU',
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
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
    { href: '#contact', label: t.nav.contact },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm" 
            : "bg-transparent"
        )}
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
              <span className={cn(
                "font-serif text-2xl lg:text-3xl font-medium italic tracking-tight transition-colors",
                isScrolled ? "text-slate-900" : "text-white"
              )}>
                Karaca Bey
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                item.isLink ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative font-sans text-sm font-light tracking-[0.15em] uppercase transition-colors group",
                      isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"
                    )}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                ) : (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative font-sans text-sm font-light tracking-[0.15em] uppercase transition-colors group",
                      isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"
                    )}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </motion.a>
                )
              ))}
            </div>

            {/* Language Selector & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Language Selector with Globe Icon */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-sans font-light transition-colors",
                    isScrolled ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span>{localeShort[locale]}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", isLangOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isLangOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 shadow-lg z-50"
                      >
                        {locales.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => {
                              setLocale(loc)
                              setIsLangOpen(false)
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 text-sm font-sans font-light transition-colors",
                              locale === loc 
                                ? "bg-slate-100 text-slate-900" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            {localeNames[loc]}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "lg:hidden p-2 transition-colors",
                  isScrolled ? "text-slate-900" : "text-white"
                )}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Subtle accent line */}
        <div className={cn(
          "h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent transition-opacity duration-500",
          isScrolled ? "opacity-100" : "opacity-0"
        )} />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white"
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
                  className="p-2 text-slate-900"
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
                        className="font-serif text-3xl font-medium italic text-slate-900"
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
                      className="font-serif text-3xl font-medium italic text-slate-900"
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
                    className={cn(
                      "text-sm font-sans font-light tracking-wider uppercase px-5 py-2.5 transition-all",
                      locale === loc
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 border border-slate-200 hover:border-slate-400"
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {localeShort[loc]}
                  </motion.button>
                ))}
              </div>

              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
