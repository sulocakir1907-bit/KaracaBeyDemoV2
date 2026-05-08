'use client'

import { useMemo, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, ChevronDown, Flame, Sparkles, TrendingUp, Globe } from 'lucide-react'
import { 
  FABRIC_DATA, 
  type FabricCategory, 
  type FabricProduct,
  type UsageArea,
  categoryLabels,
  formatComposition,
  getCategories
} from '@/lib/fabric-data'
import { cn } from '@/lib/utils'
import { type Locale, locales, getTranslation } from '@/lib/i18n'

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

// Usage area type mapping for i18n
const usageAreaKeyMap: Record<UsageArea, keyof typeof getTranslation extends (l: Locale) => infer T ? T extends { showroom: { usageAreas: infer U } } ? U : never : never> = {
  'curtains': 'curtains',
  'upholstery': 'upholstery',
  'bedding': 'bedding',
  'tablecloth': 'tablecloth',
  'cushions': 'cushions',
  'wall-panels': 'wallPanels',
  'event-decor': 'eventDecor',
  'headboards': 'headboards',
  'throws': 'throws',
}

function ProductCard({ product, locale }: { product: FabricProduct; locale: Locale }) {
  const t = getTranslation(locale)
  
  return (
    <Link 
      href={`/showroom/${product.id}?lang=${locale}`}
      className="group block bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={product.images.primary}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.new && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 text-white text-[10px] font-medium tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              {t.showroom.new}
            </span>
          )}
          {product.bestseller && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-[10px] font-medium tracking-wider uppercase">
              <TrendingUp className="w-3 h-3" />
              {t.showroom.bestseller}
            </span>
          )}
          {product.fireRetardant && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-[10px] font-medium tracking-wider uppercase">
              <Flame className="w-3 h-3" />
              FR
            </span>
          )}
        </div>

        {/* SKU Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-slate-600 text-[10px] font-mono tracking-wider">
            {product.sku}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Tag */}
        <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-slate-500">
          {categoryLabels[product.category][locale]}
        </span>
        
        {/* Product Name */}
        <h3 className="mt-1 font-sans text-base font-medium text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Technical Specs Grid */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 py-2 px-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t.showroom.width}</span>
            <span className="block text-sm font-medium text-slate-900">{product.width}cm</span>
          </div>
          <div className="bg-slate-50 py-2 px-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t.showroom.gsm}</span>
            <span className="block text-sm font-medium text-slate-900">{product.weight}</span>
          </div>
          <div className="bg-slate-50 py-2 px-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">{t.showroom.price}</span>
            <span className="block text-sm font-medium text-slate-900">{priceLabels[product.priceCategory]}</span>
          </div>
        </div>

        {/* Composition */}
        <p className="mt-3 text-xs text-slate-500 line-clamp-1">
          {formatComposition(product.composition)}
        </p>

        {/* Colors */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.showroom.colors}:</span>
          <span className="text-xs text-slate-600 line-clamp-1">
            {product.colors.slice(0, 3).join(', ')}
            {product.colors.length > 3 && ` +${product.colors.length - 3}`}
          </span>
        </div>
      </div>
    </Link>
  )
}

function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedUsage,
  setSelectedUsage,
  weightRange,
  setWeightRange,
  selectedPrice,
  setSelectedPrice,
  fireRetardantOnly,
  setFireRetardantOnly,
  onReset,
  locale,
}: {
  selectedCategory: FabricCategory | null
  setSelectedCategory: (cat: FabricCategory | null) => void
  selectedUsage: UsageArea | null
  setSelectedUsage: (usage: UsageArea | null) => void
  weightRange: [number, number]
  setWeightRange: (range: [number, number]) => void
  selectedPrice: number | null
  setSelectedPrice: (price: number | null) => void
  fireRetardantOnly: boolean
  setFireRetardantOnly: (val: boolean) => void
  onReset: () => void
  locale: Locale
}) {
  const t = getTranslation(locale)
  const categories = getCategories()
  const usageAreas: UsageArea[] = ['curtains', 'upholstery', 'bedding', 'tablecloth', 'cushions', 'wall-panels', 'event-decor', 'headboards', 'throws']

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-[0.1em] uppercase text-slate-900">
            {t.showroom.filters}
          </h2>
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            {t.showroom.resetAll}
          </button>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-slate-700">
            {t.showroom.category}
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                selectedCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {t.showroom.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm transition-colors',
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {categoryLabels[cat][locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Usage Area Filter */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-slate-700">
            {t.showroom.usageArea}
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedUsage(null)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                selectedUsage === null
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {t.showroom.allUses}
            </button>
            {usageAreas.map((usage) => (
              <button
                key={usage}
                onClick={() => setSelectedUsage(usage)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm transition-colors',
                  selectedUsage === usage
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {t.showroom.usageAreas[usageAreaKeyMap[usage]]}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Range */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-slate-700">
            {t.showroom.weight}
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={weightRange[0] || ''}
              onChange={(e) => setWeightRange([Number(e.target.value), weightRange[1]])}
              className="w-full px-3 py-2 text-sm border border-slate-200 focus:border-slate-400 focus:outline-none"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={weightRange[1] || ''}
              onChange={(e) => setWeightRange([weightRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 text-sm border border-slate-200 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Price Category */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-slate-700">
            {t.showroom.priceRange}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPrice(null)}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors',
                selectedPrice === null
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:border-slate-400'
              )}
            >
              {t.showroom.all}
            </button>
            {[1, 2, 3, 4, 5].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPrice(price)}
                className={cn(
                  'px-3 py-1.5 text-sm transition-colors',
                  selectedPrice === price
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-600 hover:border-slate-400'
                )}
              >
                {priceLabels[price]}
              </button>
            ))}
          </div>
        </div>

        {/* Fire Retardant Toggle */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fireRetardantOnly}
              onChange={(e) => setFireRetardantOnly(e.target.checked)}
              className="w-4 h-4 border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span className="text-sm text-slate-700">{t.showroom.fireRetardantOnly}</span>
          </label>
        </div>
      </div>
    </aside>
  )
}

// Language Selector Component
function LanguageSelector({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const localeNames: Record<Locale, string> = {
    en: 'English',
    tr: 'Türkçe',
    ru: 'Русский',
  }
  
  const localeFlags: Record<Locale, string> = {
    en: '🇬🇧',
    tr: '🇹🇷',
    ru: '🇷🇺',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[locale]} {localeNames[locale]}</span>
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
                  "w-full text-left px-4 py-2 text-sm transition-colors",
                  locale === l ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {localeFlags[l]} {localeNames[l]}
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
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 0])
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [fireRetardantOnly, setFireRetardantOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Sort labels with i18n
  const sortLabels: Record<SortOption, string> = {
    'name-asc': t.showroom.sortOptions.nameAsc,
    'name-desc': t.showroom.sortOptions.nameDesc,
    'weight-asc': t.showroom.sortOptions.weightAsc,
    'weight-desc': t.showroom.sortOptions.weightDesc,
    'price-asc': t.showroom.sortOptions.priceAsc,
    'price-desc': t.showroom.sortOptions.priceDesc,
  }

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedUsage(null)
    setWeightRange([0, 0])
    setSelectedPrice(null)
    setFireRetardantOnly(false)
  }, [])

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

      // Weight range filter
      if (weightRange[0] > 0 && product.weight < weightRange[0]) return false
      if (weightRange[1] > 0 && product.weight > weightRange[1]) return false

      // Price filter
      if (selectedPrice && product.priceCategory !== selectedPrice) return false

      // Fire retardant filter
      if (fireRetardantOnly && !product.fireRetardant) return false

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
  }, [searchQuery, selectedCategory, selectedUsage, weightRange, selectedPrice, fireRetardantOnly, sortBy])

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedCategory) count++
    if (selectedUsage) count++
    if (weightRange[0] > 0 || weightRange[1] > 0) count++
    if (selectedPrice) count++
    if (fireRetardantOnly) count++
    return count
  }, [selectedCategory, selectedUsage, weightRange, selectedPrice, fireRetardantOnly])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16 border-b border-slate-100">
            <Link href="/" className="text-xl font-semibold tracking-wide text-slate-900">
              Karacabey Tekstil
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                {t.showroom.home}
              </Link>
              <Link href="/showroom" className="text-sm font-medium text-slate-900">
                Showroom
              </Link>
              <Link href="/#contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                {t.showroom.contact}
              </Link>
              <LanguageSelector locale={locale} setLocale={setLocale} />
            </nav>
            {/* Mobile Language Selector */}
            <div className="md:hidden">
              <LanguageSelector locale={locale} setLocale={setLocale} />
            </div>
          </div>

          {/* Title Section */}
          <div className="py-8 text-center">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
              {t.showroom.title}
            </h1>
            <p className="mt-2 text-slate-500">
              {FABRIC_DATA.length} {t.showroom.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Search & Sort Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 text-sm text-slate-700 hover:border-slate-400 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t.showroom.filters}
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center bg-slate-900 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.showroom.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 text-sm focus:border-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 text-sm text-slate-700 focus:border-slate-400 focus:outline-none cursor-pointer bg-white"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Results Count */}
            <span className="hidden sm:block text-sm text-slate-500 whitespace-nowrap">
              {filteredProducts.length} {t.showroom.products}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedUsage={selectedUsage}
              setSelectedUsage={setSelectedUsage}
              weightRange={weightRange}
              setWeightRange={setWeightRange}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              fireRetardantOnly={fireRetardantOnly}
              setFireRetardantOnly={setFireRetardantOnly}
              onReset={resetFilters}
              locale={locale}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500">{t.showroom.noProducts}</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors"
                >
                  {t.showroom.resetFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">{t.showroom.filters}</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedUsage={selectedUsage}
                setSelectedUsage={setSelectedUsage}
                weightRange={weightRange}
                setWeightRange={setWeightRange}
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                fireRetardantOnly={fireRetardantOnly}
                setFireRetardantOnly={setFireRetardantOnly}
                onReset={resetFilters}
                locale={locale}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                {filteredProducts.length} {t.showroom.products}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
