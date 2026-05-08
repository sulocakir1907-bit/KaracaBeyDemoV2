'use client'

import { useMemo, useState, useCallback, useRef } from 'react'
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
  ZoomIn
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
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'

// Category icons mapping
const categoryIcons: Record<FabricCategory, string> = {
  velvet: '/images/fabric-velvet.jpg',
  satin: '/images/fabric-satin.jpg',
  linen: '/images/fabric-linen.jpg',
  jacquard: '/images/fabric-jacquard.jpg',
  silk: '/images/fabric-silk.jpg',
  chenille: '/images/fabric-chenille.jpg',
  organza: '/images/fabric-organza.jpg',
  taffeta: '/images/fabric-taffeta.jpg',
  brocade: '/images/fabric-brocade.jpg',
  damask: '/images/fabric-damask.jpg',
  suede: '/images/fabric-suede.jpg',
  blackout: '/images/fabric-blackout.jpg',
  sheer: '/images/fabric-sheer.jpg',
}

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
      />
      
      {/* Magnifier Lens */}
      <AnimatePresence>
        {showMagnifier && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute w-40 h-40 rounded-full border-2 border-white shadow-2xl pointer-events-none overflow-hidden"
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
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-slate-900/80 text-white text-xs">
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
  onClick 
}: { 
  product: FabricProduct
  locale: Locale
  onClick: () => void
}) {
  const t = getTranslation(locale)
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group bg-white border border-slate-200 hover:border-slate-400 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Magnifier Preview on Hover */}
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
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.new && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 text-white text-[10px] font-sans font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              {t.showroom.new}
            </span>
          )}
          {product.bestseller && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-[10px] font-sans font-bold tracking-wider uppercase">
              <TrendingUp className="w-3 h-3" />
              {t.showroom.bestseller}
            </span>
          )}
          {product.fireRetardant && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-[10px] font-sans font-bold tracking-wider uppercase">
              <Flame className="w-3 h-3" />
              FR
            </span>
          )}
        </div>

        {/* SKU Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-white/95 backdrop-blur-sm text-slate-600 text-[10px] font-mono tracking-wider">
            {product.sku}
          </span>
        </div>
        
        {/* Hover Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-slate-900/40 flex items-center justify-center"
        >
          <span className="px-4 py-2 bg-white text-slate-900 text-sm font-sans font-medium tracking-wider uppercase">
            View Details
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Tag */}
        <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-slate-500">
          {categoryLabels[product.category][locale]}
        </span>
        
        {/* Product Name */}
        <h3 className="mt-1 font-serif text-lg font-medium text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Technical Specs Grid */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="bg-slate-50 py-2 px-1 text-center border border-slate-100">
            <span className="block text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">WIDTH</span>
            <span className="block text-sm font-sans font-light text-slate-900">{product.width}cm</span>
          </div>
          <div className="bg-slate-50 py-2 px-1 text-center border border-slate-100">
            <span className="block text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">GSM</span>
            <span className="block text-sm font-sans font-light text-slate-900">{product.weight}</span>
          </div>
          <div className="bg-slate-50 py-2 px-1 text-center border border-slate-100">
            <span className="block text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider">PRICE</span>
            <span className="block text-sm font-sans font-light text-slate-900">{priceLabels[product.priceCategory]}</span>
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
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 bg-white">
        <ScrollArea className="h-full">
          <div className="pb-8">
            {/* Header */}
            <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-serif text-xl font-medium text-slate-900">
                  {product.name}
                </SheetTitle>
              </div>
              <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-slate-500">
                {categoryLabels[product.category][locale]} | {product.sku}
              </span>
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
              <h4 className="font-serif text-lg font-bold uppercase tracking-widest text-slate-900 mb-4">
                Technical Specifications
              </h4>
              
              <div className="space-y-0 border border-slate-200">
                {/* Width */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Ruler className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">WIDTH</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{product.width} cm</span>
                  </div>
                </div>
                
                {/* Weight / GSM */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Weight className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">GSM</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{product.weight} g/m²</span>
                  </div>
                </div>
                
                {/* Composition */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Droplets className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">COMPOSITION</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{formatComposition(product.composition)}</span>
                  </div>
                </div>
                
                {/* Usage Areas */}
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Shirt className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">RECOMMENDED USE</span>
                    <span className="block text-sm font-sans font-light text-slate-900">
                      {product.usageAreas.map(area => usageAreaLabels[area][locale]).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Additional Specs */}
              {(product.martindale || product.lightFastness || product.fireRetardant) && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {product.martindale && (
                    <div className="bg-slate-50 p-3 text-center border border-slate-200">
                      <span className="block text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400">MARTINDALE</span>
                      <span className="block text-sm font-sans font-light text-slate-900">{product.martindale.toLocaleString()}</span>
                    </div>
                  )}
                  {product.lightFastness && (
                    <div className="bg-slate-50 p-3 text-center border border-slate-200">
                      <span className="block text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400">LIGHT FAST</span>
                      <span className="block text-sm font-sans font-light text-slate-900">{product.lightFastness}/8</span>
                    </div>
                  )}
                  {product.fireRetardant && (
                    <div className="bg-red-50 p-3 text-center border border-red-200">
                      <span className="block text-[9px] font-sans font-bold uppercase tracking-wider text-red-400">FIRE RATED</span>
                      <span className="block text-sm font-sans font-light text-red-700">FR Certified</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Functionality Text */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">
                Fabric Profile
              </h4>
              <p className="text-sm font-sans font-light text-slate-600 leading-relaxed">
                {product.name} is a premium {categoryLabels[product.category][locale].toLowerCase()} fabric ideal for {product.usageAreas.slice(0, 2).map(area => usageAreaLabels[area][locale].toLowerCase()).join(' and ')}. 
                With a weight of {product.weight} g/m² and {product.width}cm width, this fabric offers excellent durability and a luxurious feel that elevates any interior space.
              </p>
            </div>
            
            {/* Colors */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">
                Available Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-sans font-light border border-slate-200"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Care Instructions */}
            <div className="px-4 pt-6">
              <h4 className="font-serif text-lg font-bold uppercase tracking-widest text-slate-900 mb-3">
                Care Instructions
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.washingInstructions.map((instruction, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-sans font-light border border-slate-200"
                  >
                    {washingInstructionLabels[instruction][locale]}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA - Request Quote */}
            <div className="px-4 pt-8">
              <a
                href={`https://wa.me/905551234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white font-sans text-sm font-medium tracking-wider uppercase hover:bg-slate-800 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Request Quote
              </a>
              <p className="mt-3 text-center text-xs font-sans font-light text-slate-500">
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
      <div className="sticky top-24">
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

// Language Selector Component
function LanguageSelector({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const localeNames: Record<Locale, string> = {
    en: 'English',
    tr: 'Turkce',
    ru: 'Russkiy',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-sans font-light text-slate-700 hover:text-slate-900 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeNames[locale]}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-lg z-50">
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
          </div>
        </>
      )}
    </div>
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
  
  // Product detail drawer
  const [selectedProduct, setSelectedProduct] = useState<FabricProduct | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
    'weight-asc': 'Weight (Low to High)',
    'weight-desc': 'Weight (High to Low)',
    'price-asc': 'Price (Low to High)',
    'price-desc': 'Price (High to Low)',
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

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              <span className="font-serif text-2xl font-medium tracking-wide text-slate-900">
                Karaca Bey
              </span>
            </Link>
            
            {/* Navigation */}
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
            
            {/* Language Selector */}
            <LanguageSelector locale={locale} setLocale={setLocale} />
          </div>
        </div>
      </header>

      {/* Page Title */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-medium italic tracking-tight text-slate-900">
            Digital Fabric Showroom
          </h1>
          <p className="mt-3 font-sans text-lg font-light text-slate-500">
            {FABRIC_DATA.length} premium fabrics with technical specifications
          </p>
        </div>
      </section>

      {/* Search & Sort Bar */}
      <div className="sticky top-20 z-40 bg-white border-b border-slate-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 py-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU, or pattern..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 text-sm font-sans font-light placeholder:text-slate-400 focus:border-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 border border-slate-200 text-sm font-sans font-light text-slate-700 focus:border-slate-400 focus:outline-none appearance-none cursor-pointer bg-white"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="hidden sm:block text-sm font-sans font-light text-slate-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        <div className="flex gap-12">
          {/* Sidebar */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            locale={locale}
            productCounts={productCounts}
          />
          
          {/* Product Grid */}
          <main className="flex-1">
            {/* Mobile Category Pills */}
            <div className="lg:hidden mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-4 py-2 text-sm font-sans font-light whitespace-nowrap transition-colors",
                    selectedCategory === null
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  All ({productCounts.all})
                </button>
                {getCategories().map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 text-sm font-sans font-light whitespace-nowrap transition-colors",
                      selectedCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {categoryLabels[cat][locale]} ({productCounts[cat]})
                  </button>
                ))}
              </div>
            </div>
            
            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="font-sans text-lg font-light text-slate-500">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                    setSelectedUsage(null)
                  }}
                  className="mt-4 px-6 py-2 border border-slate-300 text-sm font-sans font-light text-slate-700 hover:bg-slate-50 transition-colors"
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
    </div>
  )
}
