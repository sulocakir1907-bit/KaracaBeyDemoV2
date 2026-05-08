'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  Globe, 
  ChevronDown,
  Ruler,
  Weight,
  Droplets,
  Shirt,
  Flame,
  Sparkles,
  TrendingUp,
  MessageCircle,
  ArrowLeft,
  ZoomIn,
  Menu,
  Filter,
  SlidersHorizontal,
  ChevronUp
} from 'lucide-react'
import { 
  FABRIC_DATA, 
  type FabricCategory, 
  type FabricProduct,
  type UsageArea,
  categoryLabels,
  usageAreaLabels,
  formatComposition,
  getCategories,
  washingInstructionLabels
} from '@/lib/fabric-data'
import { cn } from '@/lib/utils'
import { type Locale, locales, getTranslation } from '@/lib/i18n'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'

// Price category display
const priceLabels: Record<number, string> = {
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
  5: '$$$$$',
}

// Sort options
type SortOption = 'name-asc' | 'name-desc' | 'weight-asc' | 'weight-desc' | 'price-asc' | 'price-desc'

// Texture Magnifier Component
function TextureMagnifier({ 
  src, 
  alt,
  magnification = 2.5
}: { 
  src: string
  alt: string
  magnification?: number
}) {
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setMagnifierPosition({ x, y })
    setCursorPosition({ x: e.clientX - left, y: e.clientY - top })
  }, [])

  return (
    <div 
      ref={imageRef}
      className="relative w-full aspect-square overflow-hidden cursor-crosshair bg-slate-100"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      
      {/* Magnifier Lens - Desktop only */}
      <AnimatePresence>
        {showMagnifier && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white shadow-2xl pointer-events-none overflow-hidden hidden md:block"
            style={{
              left: cursorPosition.x - 80,
              top: cursorPosition.y - 80,
              backgroundImage: `url(${src})`,
              backgroundSize: `${magnification * 100}%`,
              backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-0 rounded-full ring-4 ring-white/20" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hint */}
      <div className="absolute bottom-3 right-3 hidden md:flex items-center gap-1.5 px-2 py-1 bg-slate-900/80 text-white text-xs">
        <ZoomIn className="w-3 h-3" />
        <span className="font-sans font-light">Hover to magnify</span>
      </div>
    </div>
  )
}

// Product Card with Magnifier Preview
function ProductCard({ 
  product, 
  locale, 
  onClick,
  index
}: { 
  product: FabricProduct
  locale: Locale
  onClick: () => void
  index: number
}) {
  const t = getTranslation(locale)
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-white border border-slate-200 hover:border-slate-400 transition-all duration-300 cursor-pointer active:scale-[0.98]"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={product.images.primary}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered && "scale-110"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading={index < 8 ? "eager" : "lazy"}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 md:gap-2">
          {product.new && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-slate-900 text-white text-[8px] md:text-[10px] font-sans font-bold tracking-wider uppercase">
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {t.showroom.new}
            </span>
          )}
          {product.bestseller && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-amber-500 text-white text-[8px] md:text-[10px] font-sans font-bold tracking-wider uppercase">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {t.showroom.bestseller}
            </span>
          )}
          {product.fireRetardant && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-red-600 text-white text-[8px] md:text-[10px] font-sans font-bold tracking-wider uppercase">
              <Flame className="w-2.5 h-2.5 md:w-3 md:h-3" />
              FR
            </span>
          )}
        </div>

        {/* SKU Badge */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3">
          <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-white/95 backdrop-blur-sm text-slate-600 text-[8px] md:text-[10px] font-mono tracking-wider">
            {product.sku}
          </span>
        </div>
        
        {/* Hover Overlay - Desktop only */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-slate-900/40 items-center justify-center hidden md:flex"
        >
          <span className="px-4 py-2 bg-white text-slate-900 text-sm font-sans font-medium tracking-wider uppercase">
            View Details
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        {/* Category Tag */}
        <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-slate-500">
          {categoryLabels[product.category][locale]}
        </span>
        
        {/* Product Name */}
        <h3 className="mt-0.5 md:mt-1 font-serif text-base md:text-lg font-medium text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Technical Specs Grid */}
        <div className="mt-2 md:mt-3 grid grid-cols-3 gap-1 md:gap-1.5">
          <div className="bg-slate-50 py-1.5 md:py-2 px-1 text-center border border-slate-100">
            <span className="block text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">WIDTH</span>
            <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{product.width}cm</span>
          </div>
          <div className="bg-slate-50 py-1.5 md:py-2 px-1 text-center border border-slate-100">
            <span className="block text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">GSM</span>
            <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{product.weight}</span>
          </div>
          <div className="bg-slate-50 py-1.5 md:py-2 px-1 text-center border border-slate-100">
            <span className="block text-[8px] md:text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">PRICE</span>
            <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{priceLabels[product.priceCategory]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Product Detail Drawer
function ProductDetailDrawer({
  product,
  isOpen,
  onClose,
  locale
}: {
  product: FabricProduct | null
  isOpen: boolean
  onClose: () => void
  locale: Locale
}) {
  const t = getTranslation(locale)
  
  if (!product) return null
  
  const whatsappMessage = encodeURIComponent(
    `Hello Karaca Bey, I am interested in ${product.name} (${product.sku}). I would like to request a quote for my project.`
  )
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 bg-white overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pb-8">
            {/* Header */}
            <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 pr-12">
              <SheetTitle className="font-serif text-lg md:text-xl font-medium text-slate-900 pr-4">
                {product.name}
              </SheetTitle>
              <SheetDescription className="text-[10px] md:text-xs font-sans font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-slate-500">
                {categoryLabels[product.category][locale]} | {product.sku}
              </SheetDescription>
            </SheetHeader>
            
            {/* Texture Magnifier */}
            <div className="px-4 pt-4">
              <TextureMagnifier 
                src={product.images.primary} 
                alt={product.name}
                magnification={2.5}
              />
            </div>
            
            {/* Technical Specifications Table */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-base md:text-lg font-bold uppercase tracking-widest text-slate-900 mb-4">
                Technical Specifications
              </h4>
              
              <div className="space-y-0 border border-slate-200">
                {/* Width */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Ruler className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5 md:py-3">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">WIDTH</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{product.width} cm</span>
                  </div>
                </div>
                
                {/* Weight / GSM */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Weight className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5 md:py-3">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">GSM</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{product.weight} g/m²</span>
                  </div>
                </div>
                
                {/* Composition */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Droplets className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5 md:py-3">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">COMPOSITION</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{formatComposition(product.composition)}</span>
                  </div>
                </div>
                
                {/* Usage Areas */}
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Shirt className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5 md:py-3">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">RECOMMENDED USE</span>
                    <span className="block text-sm font-sans font-light text-slate-900">
                      {product.usageAreas.map(area => usageAreaLabels[area][locale]).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Additional Specs */}
              {(product.martindale || product.lightFastness || product.fireRetardant) && (
                <div className="mt-4 grid grid-cols-3 gap-1.5 md:gap-2">
                  {product.martindale && (
                    <div className="bg-slate-50 p-2 md:p-3 text-center border border-slate-200">
                      <span className="block text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400">MARTINDALE</span>
                      <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{product.martindale.toLocaleString()}</span>
                    </div>
                  )}
                  {product.lightFastness && (
                    <div className="bg-slate-50 p-2 md:p-3 text-center border border-slate-200">
                      <span className="block text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400">LIGHT FAST</span>
                      <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{product.lightFastness}/8</span>
                    </div>
                  )}
                  {product.fireRetardant && (
                    <div className="bg-red-50 p-2 md:p-3 text-center border border-red-200">
                      <span className="block text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-wider text-red-400">FIRE RATED</span>
                      <span className="block text-xs md:text-sm font-sans font-light text-red-700">FR Certified</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Functionality Text */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-base md:text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">
                Fabric Profile
              </h4>
              <p className="text-sm font-sans font-light text-slate-600 leading-relaxed">
                {product.name} is a premium {categoryLabels[product.category][locale].toLowerCase()} fabric ideal for {product.usageAreas.slice(0, 2).map(area => usageAreaLabels[area][locale].toLowerCase()).join(' and ')}. 
                With a weight of {product.weight} g/m² and {product.width}cm width, this fabric offers excellent durability and a luxurious feel that elevates any interior space.
              </p>
            </div>
            
            {/* Colors */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-base md:text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">
                Available Colors
              </h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {product.colors.map((color, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 text-slate-700 text-[10px] md:text-xs font-sans font-light border border-slate-200"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Care Instructions */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-base md:text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">
                Care Instructions
              </h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {product.washingInstructions.map((instruction, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 md:px-3 md:py-1.5 bg-slate-50 text-slate-600 text-[10px] md:text-xs font-sans font-light border border-slate-200"
                  >
                    {washingInstructionLabels[instruction][locale]}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA - Request Quote */}
            <div className="px-4 pt-8 pb-4">
              <a
                href={`https://wa.me/905551234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 md:py-4 bg-green-600 text-white font-sans text-sm font-medium tracking-wider uppercase hover:bg-green-700 active:bg-green-800 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Request Quote via WhatsApp
              </a>
              <p className="mt-3 text-center text-[10px] md:text-xs font-sans font-light text-slate-500">
                Minimum order: {product.minOrder} meters
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Sidebar Category Navigation
function CategorySidebar({
  selectedCategory,
  setSelectedCategory,
  locale,
  productCounts
}: {
  selectedCategory: FabricCategory | null
  setSelectedCategory: (cat: FabricCategory | null) => void
  locale: Locale
  productCounts: Record<FabricCategory | 'all', number>
}) {
  const categories = getCategories()
  
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-[136px]">
        <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-slate-900 mb-6">
          Categories
        </h2>
        
        <nav className="space-y-1">
          {/* All Fabrics */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 border-l-2",
              selectedCategory === null
                ? "bg-slate-900 text-white border-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-300"
            )}
          >
            <span className="font-sans text-sm font-light">All Fabrics</span>
            <span className={cn(
              "text-xs font-sans font-light",
              selectedCategory === null ? "text-slate-400" : "text-slate-400"
            )}>
              {productCounts.all}
            </span>
          </button>
          
          {/* Category List */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 border-l-2",
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-300"
              )}
            >
              <span className="font-sans text-sm font-light">{categoryLabels[cat][locale]}</span>
              <span className={cn(
                "text-xs font-sans font-light",
                selectedCategory === cat ? "text-slate-400" : "text-slate-400"
              )}>
                {productCounts[cat] || 0}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

// Mobile Filter Sheet
function MobileFilterSheet({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  locale,
  productCounts,
  sortBy,
  setSortBy
}: {
  isOpen: boolean
  onClose: () => void
  selectedCategory: FabricCategory | null
  setSelectedCategory: (cat: FabricCategory | null) => void
  locale: Locale
  productCounts: Record<FabricCategory | 'all', number>
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
}) {
  const categories = getCategories()
  
  const sortLabels: Record<SortOption, string> = {
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'weight-asc': 'Weight (Low to High)',
    'weight-desc': 'Weight (High to Low)',
    'price-asc': 'Price (Low to High)',
    'price-desc': 'Price (High to Low)',
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] p-0 bg-white rounded-t-2xl">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-2" />
        <ScrollArea className="h-full">
          <div className="px-4 pb-8">
            <SheetHeader className="pb-4 border-b border-slate-200">
              <SheetTitle className="font-serif text-xl font-bold text-slate-900 text-left">
                Filters & Sort
              </SheetTitle>
              <SheetDescription className="sr-only">
                Filter products by category and sort order
              </SheetDescription>
            </SheetHeader>
            
            {/* Sort Section */}
            <div className="pt-6">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Sort By
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(sortLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setSortBy(value as SortOption)}
                    className={cn(
                      "px-3 py-2.5 text-sm font-sans font-light text-left border transition-colors",
                      sortBy === value
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Categories Section */}
            <div className="pt-8">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    onClose()
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left border transition-colors",
                    selectedCategory === null
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200"
                  )}
                >
                  <span className="font-sans text-sm">All Fabrics</span>
                  <span className="text-xs font-light opacity-70">{productCounts.all}</span>
                </button>
                
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat)
                      onClose()
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left border transition-colors",
                      selectedCategory === cat
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200"
                    )}
                  >
                    <span className="font-sans text-sm">{categoryLabels[cat][locale]}</span>
                    <span className="text-xs font-light opacity-70">{productCounts[cat] || 0}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Apply Button */}
            <div className="pt-8">
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white font-sans text-sm font-medium uppercase tracking-wider hover:bg-slate-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Language Selector Component
function LanguageSelector({ locale, setLocale, isMobile = false }: { locale: Locale; setLocale: (l: Locale) => void; isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-2 text-xs md:text-sm font-sans font-light text-slate-700 hover:text-slate-900 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="sm:hidden">{localeShort[locale]}</span>
        <ChevronDown className={cn("w-3 h-3 md:w-4 md:h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-1 w-36 md:w-40 bg-white border border-slate-200 shadow-lg z-50"
            >
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLocale(l)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm font-sans font-light transition-colors",
                    locale === l ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {localeNames[l]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mobile Navigation Menu
function MobileNavMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-white md:hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-serif text-xl font-medium text-slate-900">Menu</span>
              <button onClick={onClose} className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Nav Links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-6">
              <Link 
                href="/" 
                onClick={onClose}
                className="font-serif text-2xl font-medium text-slate-900"
              >
                Home
              </Link>
              <span className="font-serif text-2xl font-medium text-slate-900 border-b-2 border-slate-900 pb-1">
                Showroom
              </span>
              <Link 
                href="/#contact" 
                onClick={onClose}
                className="font-serif text-2xl font-medium text-slate-900"
              >
                Contact
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Scroll to Top Button
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function ShowroomPage() {
  // Locale state
  const [locale, setLocale] = useState<Locale>('en')
  const t = getTranslation(locale)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FabricCategory | null>(null)
  const [selectedUsage, setSelectedUsage] = useState<UsageArea | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  
  // UI states
  const [selectedProduct, setSelectedProduct] = useState<FabricProduct | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<FabricCategory | 'all', number> = {
      all: FABRIC_DATA.length,
      velvet: 0, satin: 0, linen: 0, jacquard: 0, silk: 0,
      chenille: 0, organza: 0, taffeta: 0, brocade: 0, damask: 0,
      suede: 0, blackout: 0, sheer: 0
    }
    FABRIC_DATA.forEach(p => {
      counts[p.category]++
    })
    return counts
  }, [])

  // Sort labels
  const sortLabels: Record<SortOption, string> = {
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'weight-asc': 'Weight (Low-High)',
    'weight-desc': 'Weight (High-Low)',
    'price-asc': 'Price (Low-High)',
    'price-desc': 'Price (High-Low)',
  }

  // Memoized filtered and sorted products - O(n) performance
  const filteredProducts = useMemo(() => {
    let results = FABRIC_DATA.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesSku = product.sku.toLowerCase().includes(query)
        const matchesPattern = product.pattern?.toLowerCase().includes(query)
        if (!matchesName && !matchesSku && !matchesPattern) return false
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) return false

      // Usage filter
      if (selectedUsage && !product.usageAreas.includes(selectedUsage)) return false

      return true
    })

    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'weight-asc':
          return a.weight - b.weight
        case 'weight-desc':
          return b.weight - a.weight
        case 'price-asc':
          return a.priceCategory - b.priceCategory
        case 'price-desc':
          return b.priceCategory - a.priceCategory
        default:
          return 0
      }
    })

    return results
  }, [searchQuery, selectedCategory, selectedUsage, sortBy])

  // Handle product click
  const handleProductClick = useCallback((product: FabricProduct) => {
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }, [])

  // Active filter count
  const activeFilterCount = (selectedCategory ? 1 : 0) + (searchQuery ? 1 : 0)

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              <span className="font-serif text-lg md:text-2xl font-medium tracking-wide text-slate-900">
                Karaca Bey
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-sans font-light text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <span className="text-sm font-sans font-medium text-slate-900 border-b border-slate-900 pb-0.5">
                Showroom
              </span>
              <Link href="/#contact" className="text-sm font-sans font-light text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </nav>
            
            {/* Right Side - Language & Mobile Menu */}
            <div className="flex items-center gap-2">
              <LanguageSelector locale={locale} setLocale={setLocale} />
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileNavOpen(true)}
                className="md:hidden p-2 -mr-2"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <MobileNavMenu isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Page Title */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12">
          <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-medium italic tracking-tight text-slate-900">
            Digital Fabric Showroom
          </h1>
          <p className="mt-2 md:mt-3 font-sans text-sm md:text-lg font-light text-slate-500">
            {FABRIC_DATA.length} premium fabrics with technical specifications
          </p>
        </div>
      </section>

      {/* Search & Sort Bar */}
      <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-center gap-2 md:gap-4 py-3 md:py-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fabrics..."
                className="w-full pl-9 md:pl-12 pr-9 md:pr-10 py-2.5 md:py-3 border border-slate-200 text-sm font-sans font-light placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 text-sm font-sans font-light hover:border-slate-400 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-slate-900 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="hidden lg:block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 border border-slate-200 text-sm font-sans font-light text-slate-700 focus:border-slate-400 focus:outline-none appearance-none cursor-pointer bg-white pr-10"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="hidden sm:block text-xs md:text-sm font-sans font-light text-slate-500 whitespace-nowrap">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar - Desktop Only */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            locale={locale}
            productCounts={productCounts}
          />
          
          {/* Product Grid */}
          <main className="flex-1">
            {/* Mobile Results & Active Filters */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <span className="text-sm font-sans font-light text-slate-500">
                {filteredProducts.length} products
              </span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 text-xs"
                >
                  {categoryLabels[selectedCategory][locale]}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            
            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      onClick={() => handleProductClick(product)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-16 md:py-20">
                <p className="font-sans text-base md:text-lg font-light text-slate-500">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                    setSelectedUsage(null)
                  }}
                  className="mt-4 px-6 py-2.5 border border-slate-300 text-sm font-sans font-light text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        locale={locale}
      />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        locale={locale}
        productCounts={productCounts}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  )
}
