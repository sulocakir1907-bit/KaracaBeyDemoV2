'use client'

import { type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpringButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-gold text-navy hover:bg-gold-light',
  secondary: 'bg-navy text-ivory hover:bg-navy-light',
  outline: 'border border-gold text-gold hover:bg-gold/10',
  ghost: 'text-gold hover:bg-gold/10',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function SpringButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: SpringButtonProps) {
  return (
    <motion.button
      className={cn(
        'font-sans tracking-[0.15em] uppercase transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
