'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const fabricPieces = [
  { id: 1, x: '10%', y: '20%', size: 120, rotation: 15, delay: 0 },
  { id: 2, x: '85%', y: '15%', size: 80, rotation: -20, delay: 0.5 },
  { id: 3, x: '75%', y: '70%', size: 100, rotation: 25, delay: 1 },
  { id: 4, x: '5%', y: '75%', size: 90, rotation: -10, delay: 1.5 },
  { id: 5, x: '50%', y: '85%', size: 70, rotation: 30, delay: 2 },
  { id: 6, x: '90%', y: '45%', size: 60, rotation: -35, delay: 0.8 },
]

function FabricPiece({ x, y, size, rotation, delay }: { 
  x: string
  y: string
  size: number
  rotation: number
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
      animate={{ 
        opacity: [0.15, 0.25, 0.15],
        scale: [0.95, 1, 0.95],
        rotate: [rotation - 5, rotation + 5, rotation - 5],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute pointer-events-none"
      style={{ 
        left: x, 
        top: y,
        width: size,
        height: size * 0.8,
      }}
    >
      {/* Fabric swatch visualization */}
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full"
        style={{ filter: 'blur(1px)' }}
      >
        <defs>
          <linearGradient id={`fabric-gradient-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B89B5E" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#D4BC84" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B7340" stopOpacity="0.2" />
          </linearGradient>
          <filter id={`fabric-shadow-${delay}`}>
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#B89B5E" floodOpacity="0.3" />
          </filter>
        </defs>
        <path
          d="M10,5 Q25,0 50,8 Q75,16 90,10 L95,70 Q80,75 50,68 Q20,61 5,67 Z"
          fill={`url(#fabric-gradient-${delay})`}
          filter={`url(#fabric-shadow-${delay})`}
        />
        {/* Fabric texture lines */}
        <g stroke="#B89B5E" strokeOpacity="0.15" strokeWidth="0.5">
          <line x1="15" y1="15" x2="85" y2="20" />
          <line x1="12" y1="30" x2="88" y2="35" />
          <line x1="10" y1="45" x2="90" y2="50" />
          <line x1="8" y1="60" x2="92" y2="65" />
        </g>
      </svg>
    </motion.div>
  )
}

export function FloatingFabric() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      {fabricPieces.map((piece, index) => (
        <motion.div
          key={piece.id}
          style={{ y: index % 2 === 0 ? y1 : y2 }}
        >
          <FabricPiece {...piece} />
        </motion.div>
      ))}
      
      {/* Additional subtle particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-gold/20"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${15 + (i * 6)}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6 + i * 0.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  )
}
