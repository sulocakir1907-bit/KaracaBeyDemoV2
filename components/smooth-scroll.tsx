'use client'

import { useEffect, useRef } from 'react'

export function SmoothScroll() {
  const lenisRef = useRef<InstanceType<typeof import('@studio-freight/lenis').default> | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Dynamically import Lenis to avoid SSR issues
    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default
        
        lenisRef.current = new Lenis({
          duration: 1.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        })

        function raf(time: number) {
          lenisRef.current?.raf(time)
          rafIdRef.current = requestAnimationFrame(raf)
        }

        rafIdRef.current = requestAnimationFrame(raf)
      } catch (error) {
        // Fallback to native scroll if Lenis fails
        console.warn('Lenis smooth scroll initialization failed, using native scroll')
      }
    }

    initLenis()

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenisRef.current?.destroy()
    }
  }, [])

  return null
}
