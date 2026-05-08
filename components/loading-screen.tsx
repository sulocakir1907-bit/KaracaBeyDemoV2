'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[1000] bg-navy flex flex-col items-center justify-center"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.span 
              className="font-serif text-4xl md:text-5xl text-ivory block mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Karaca Bey
            </motion.span>
            
            {/* Loading Bar */}
            <div className="w-48 h-[2px] bg-ivory/20 mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-ivory/50 text-xs tracking-[0.3em] uppercase mt-6 block"
            >
              Premium Textiles
            </motion.span>
          </motion.div>

          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gold/30" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gold/30" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-gold/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-gold/30" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
