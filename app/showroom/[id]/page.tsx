'use client'

import { useState, useRef, useCallback, use, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ZoomIn, 
  Ruler, 
  Scale, 
  Droplets, 
  Flame, 
  Sun, 
  MessageCircle,
  Mail,
  ChevronRight,
  Check,
  Info,
  Globe,
  ChevronDown
} from 'lucide-react'
import { 
  FABRIC_DATA,
  getProductById,
  getProductsByCategory,
  formatComposition,
  categoryLabels,
  usageAreaLabels,
  washingInstructionLabels,
  type FabricProduct
} from '@/lib/fabric-data'
import { cn } from '@/lib/utils'
import { type Locale, locales, getTranslation } from '@/lib/i18n'

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

// Magnifier component for texture inspection
const LENS_SIZE = 180 // px

function TextureMagnifier({ 
  src, 
  alt,
  magnification = 3,
  hoverText
}: { 
  src: string
  alt: string
  magnification?: number
  hoverText: string
}) {
  const [isActive, setIsActive] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Track container size for accurate magnification math
  useEffect(() => {
    if (!containerRef.current) return
    
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    
    updateSize()
    
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.current)
    
    return () => resizeObserver.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    // Cursor position in pixels relative to container
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCursorPos({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => setIsActive(true), [])
  const handleMouseLeave = useCallback(() => setIsActive(false), [])

  // Calculate background position so cursor point appears centered in lens
  // The background is sized at (containerSize * magnification)
  // We want the point (cursorX * magnification, cursorY * magnification) to be at the lens center (LENS_SIZE / 2)
  const bgWidth = containerSize.width * magnification
  const bgHeight = containerSize.height * magnification
  const bgPosX = -(cursorPos.x * magnification - LENS_SIZE / 2)
  const bgPosY = -(cursorPos.y * magnification - LENS_SIZE / 2)

  return (
    <div className="relative">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative aspect-square overflow-hidden bg-slate-100 cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized
        />

        {/* Magnifier Lens Overlay */}
        {isActive && containerSize.width > 0 && (
          <div
            className="absolute border-2 border-white shadow-2xl rounded-full overflow-hidden pointer-events-none ring-1 ring-slate-900/20"
            style={{
              width: `${LENS_SIZE}px`,
              height: `${LENS_SIZE}px`,
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)',
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${bgWidth}px ${bgHeight}px`,
              backgroundPosition: `${bgPosX}px ${bgPosY}px`,
            }}
          />
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs text-slate-700 pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>{hoverText} ({magnification}x)</span>
        </div>
      </div>
    </div>
  )
}

// Technical specs table component
function SpecificationTable({ product, locale }: { product: FabricProduct; locale: Locale }) {
  const t = getTranslation(locale)
  
  const specs = [
    {
      icon: Ruler,
      label: t.showroom.widthLabel,
      value: `${product.width} cm`,
      description: t.showroom.fabricRollWidth,
    },
    {
      icon: Scale,
      label: t.showroom.weightLabel,
      value: `${product.weight} g/m²`,
      description: t.showroom.gramsPerSqMeter,
    },
    {
      icon: Droplets,
      label: t.showroom.compositionLabel,
      value: formatComposition(product.composition),
      description: t.showroom.materialBlend,
    },
    ...(product.martindale ? [{
      icon: Info,
      label: t.showroom.martindaleLabel,
      value: `${product.martindale.toLocaleString()} ${t.showroom.cycles}`,
      description: t.showroom.abrasionResistance,
    }] : []),
    ...(product.lightFastness ? [{
      icon: Sun,
      label: t.showroom.lightFastnessLabel,
      value: `${product.lightFastness}/8`,
      description: t.showroom.isoRating,
    }] : []),
    ...(product.fireRetardant ? [{
      icon: Flame,
      label: t.showroom.fireRetardantLabel,
      value: t.showroom.yes,
      description: t.showroom.frCertified,
    }] : []),
  ]

  return (
    <div className="border border-slate-200 divide-y divide-slate-200">
      <div className="px-4 py-3 bg-slate-50">
        <h3 className="text-sm font-medium tracking-[0.1em] uppercase text-slate-900">
          {t.showroom.technicalSpecs}
        </h3>
      </div>
      {specs.map((spec, index) => (
        <div key={index} className="flex items-start gap-4 px-4 py-3">
          <spec.icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-slate-600">{spec.label}</span>
              <span className="text-sm font-medium text-slate-900 text-right">{spec.value}</span>
            </div>
            <span className="text-xs text-slate-400">{spec.description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Quote request section
function QuoteRequest({ product, locale }: { product: FabricProduct; locale: Locale }) {
  const t = getTranslation(locale)
  
  const whatsappMessage = encodeURIComponent(
    `Hello Karacabey Tekstil,\n\nI am interested in:\n\nProduct: ${product.name}\nSKU: ${product.sku}\nCategory: ${categoryLabels[product.category][locale]}\n\nPlease provide pricing and availability information.\n\nThank you.`
  )

  const emailSubject = encodeURIComponent(`Quote Request: ${product.name} (${product.sku})`)
  const emailBody = encodeURIComponent(
    `Hello Karacabey Tekstil,\n\nI am interested in:\n\nProduct: ${product.name}\nSKU: ${product.sku}\nCategory: ${categoryLabels[product.category][locale]}\nWidth: ${product.width} cm\nWeight: ${product.weight} g/m²\nComposition: ${formatComposition(product.composition)}\n\nPlease provide pricing and availability information.\n\nThank you.`
  )

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium tracking-[0.1em] uppercase text-slate-900">
        {t.showroom.requestQuote}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`https://wa.me/905551234567?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href={`mailto:sales@karacabey.com?subject=${emailSubject}&body=${emailBody}`}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
      </div>
      <p className="text-xs text-slate-500 text-center">
        {t.showroom.minOrderLabel}: {product.minOrder} {t.showroom.meters}
      </p>
    </div>
  )
}

// Related products component
function RelatedProducts({ product, locale }: { product: FabricProduct; locale: Locale }) {
  const t = getTranslation(locale)
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  if (relatedProducts.length === 0) return null

  return (
    <section className="mt-16 pt-16 border-t border-slate-200">
      <h2 className="text-xl font-medium text-slate-900 mb-8">
        {t.showroom.relatedProducts}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((related) => (
          <Link
            key={related.id}
            href={`/showroom/${related.id}?lang=${locale}`}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100 mb-3">
              <Image
                src={related.images.primary}
                alt={related.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-1">
              {related.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {related.width}cm | {related.weight} GSM
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const product = getProductById(resolvedParams.id)
  
  // Get initial locale from URL or default to 'en'
  const initialLocale = (searchParams.get('lang') as Locale) || 'en'
  const [locale, setLocale] = useState<Locale>(
    locales.includes(initialLocale) ? initialLocale : 'en'
  )
  const t = getTranslation(locale)

  // Update URL when locale changes
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', locale)
    window.history.replaceState({}, '', url.toString())
  }, [locale])

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-slate-900 mb-4">{t.showroom.productNotFound}</h1>
          <p className="text-slate-500 mb-8">{t.showroom.productNotFoundDesc}</p>
          <Link
            href="/showroom"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.showroom.backToShowroom}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold tracking-wide text-slate-900">
              Karacabey Tekstil
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                {t.showroom.home}
              </Link>
              <Link href="/showroom" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
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
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/showroom" className="text-slate-500 hover:text-slate-900 transition-colors">
              Showroom
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-500">{categoryLabels[product.category][locale]}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image with Magnifier */}
          <div className="space-y-4">
            <TextureMagnifier 
              src={product.images.primary} 
              alt={product.name}
              magnification={2.5}
              hoverText={t.showroom.hoverToInspect}
            />
            
            {/* Image thumbnails placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative aspect-square overflow-hidden bg-slate-100 border-2",
                    i === 1 ? "border-slate-900" : "border-transparent hover:border-slate-300"
                  )}
                >
                  <Image
                    src={product.images.primary}
                    alt={`${product.name} view ${i}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-slate-500">
                  {categoryLabels[product.category][locale]}
                </span>
                {product.new && (
                  <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-medium tracking-wider uppercase">
                    {t.showroom.new}
                  </span>
                )}
                {product.bestseller && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-medium tracking-wider uppercase">
                    {t.showroom.bestseller}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-medium text-slate-900">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-mono text-slate-500">
                SKU: {product.sku}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center py-4 bg-white border border-slate-200">
                <span className="block text-2xl font-light text-slate-900">{product.width}</span>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mt-1">{t.showroom.cmWidth}</span>
              </div>
              <div className="text-center py-4 bg-white border border-slate-200">
                <span className="block text-2xl font-light text-slate-900">{product.weight}</span>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mt-1">{t.showroom.gsmLabel}</span>
              </div>
              <div className="text-center py-4 bg-white border border-slate-200">
                <span className="block text-2xl font-light text-slate-900">{product.minOrder}</span>
                <span className="block text-xs text-slate-500 uppercase tracking-wider mt-1">{t.showroom.minMeters}</span>
              </div>
            </div>

            {/* Technical Specs Table */}
            <SpecificationTable product={product} locale={locale} />

            {/* Usage Areas */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium tracking-[0.1em] uppercase text-slate-900">
                {t.showroom.recommendedUse}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.usageAreas.map((usage) => (
                  <span
                    key={usage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-sm text-slate-700"
                  >
                    <Check className="w-3 h-3" />
                    {usageAreaLabels[usage][locale]}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Colors */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium tracking-[0.1em] uppercase text-slate-900">
                {t.showroom.availableColors}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="px-3 py-1.5 border border-slate-200 text-sm text-slate-700"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium tracking-[0.1em] uppercase text-slate-900">
                {t.showroom.careInstructions}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.washingInstructions.map((instruction) => (
                  <span
                    key={instruction}
                    className="px-3 py-1.5 bg-slate-50 text-xs text-slate-600"
                  >
                    {washingInstructionLabels[instruction][locale]}
                  </span>
                ))}
              </div>
            </div>

            {/* Quote Request */}
            <QuoteRequest product={product} locale={locale} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts product={product} locale={locale} />
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>Karacabey Tekstil - {t.showroom.premiumFabrics}</p>
        </div>
      </footer>
    </div>
  )
}
