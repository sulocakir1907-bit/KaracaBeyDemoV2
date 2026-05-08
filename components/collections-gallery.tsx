'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLocale } from '@/lib/locale-context'
import { ProductModal } from './product-modal'

type CategoryKey = 'velvet' | 'satin' | 'linen' | 'jacquard' | 'silk' | 'tablecloth'

const categoryImages: Record<CategoryKey, string> = {
  velvet: '/images/fabric-velvet.jpg',
  satin: '/images/fabric-satin.jpg',
  linen: '/images/fabric-linen.jpg',
  jacquard: '/images/fabric-jacquard.jpg',
  silk: '/images/fabric-silk.jpg',
  tablecloth: '/images/fabric-table.jpg',
}

interface CollectionTileProps {
  categoryKey: CategoryKey
  index: number
  onSelect: (key: CategoryKey) => void
}

function CollectionTile({ categoryKey, index, onSelect }: CollectionTileProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const tileRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(tileRef, { once: true, margin: '-100px' })
  const { t } = useLocale()

  const category = t.collections.categories[categoryKey]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tileRef.current) return
    const rect = tileRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={tileRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group cursor-pointer overflow-hidden ${
        index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      onClick={() => onSelect(categoryKey)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[300px] md:min-h-[400px] overflow-hidden bg-navy-light">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ backgroundImage: `url(${categoryImages[categoryKey]})` }}
          whileHover={{ scale: 1.08 }}
        />
        
        {/* Ripple Effect Overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(184, 155, 94, 0.4) 0%, transparent 50%)`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <span className="inline-block px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-gold border border-gold/30 bg-navy/50 backdrop-blur-sm">
              {t.collections.explore}
            </span>
          </motion.div>
          
          {/* Category Name */}
          <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-ivory mb-2 group-hover:text-gold transition-colors duration-500">
            {category.name}
          </h3>
          
          {/* Description */}
          <p className="font-sans text-sm text-ivory/70 leading-relaxed max-w-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            {category.description}
          </p>
          
          {/* Hover Line */}
          <div className="mt-4 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
        
        {/* Corner Accent */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}

export function CollectionsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { t } = useLocale()

  const categories: CategoryKey[] = ['velvet', 'satin', 'linen', 'jacquard', 'silk', 'tablecloth']

  return (
    <>
      <section 
        id="collections" 
        ref={sectionRef}
        className="relative py-24 md:py-32 bg-ivory"
      >
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase">Curated</span>
              <div className="w-12 h-[1px] bg-gold" />
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
              {t.collections.title}
            </h2>
            <p className="font-sans text-lg text-navy/60 max-w-2xl mx-auto">
              {t.collections.subtitle}
            </p>
            
            {/* Signature Seal */}
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 border border-gold/20 bg-cream/50">
              <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center">
                <span className="gold-foil text-xs font-serif">KB</span>
              </div>
              <span className="text-navy/60 text-xs tracking-[0.2em] uppercase">Karaca Bey Signature Collection</span>
            </div>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <CollectionTile
                key={category}
                categoryKey={category}
                index={index}
                onSelect={setSelectedCategory}
              />
            ))}
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, #0A1128 0px, #0A1128 1px, transparent 1px, transparent 80px),
                              repeating-linear-gradient(0deg, #0A1128 0px, #0A1128 1px, transparent 1px, transparent 80px)`,
          }} />
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        categoryKey={selectedCategory}
      />
    </>
  )
}
