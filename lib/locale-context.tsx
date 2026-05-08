'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Locale, getTranslation, defaultLocale } from './i18n'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getTranslation>
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])
  
  const t = getTranslation(locale)
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
