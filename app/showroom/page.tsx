'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
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
  Filter,
  ChevronUp,
  Home,
  Phone
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

import { 
  FABRIC_DATA, 
  type FabricProduct, 
  type FabricCategory,
  categoryLabels,
  usageAreaLabels,
  formatComposition,
  getCategories,
  washingInstructionLabels
} from '@/lib/fabric-data'
import { type Locale, getTranslation } from '@/lib/i18n'

// Fiyat kategorisi gosterimi
const priceLabels: Record<number, string> = {
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
  5: '$$$$$',
}

// Siralama secenekleri
type SortOption = 'name-asc' | 'name-desc' | 'weight-asc' | 'weight-desc' | 'price-asc' | 'price-desc'

// Coklu dil etiketleri
const labels = {
  width: { tr: 'EN', en: 'WIDTH', ru: 'ШИРИНА' },
  gsm: { tr: 'GSM', en: 'GSM', ru: 'ПЛОТНОСТЬ' },
  price: { tr: 'FİYAT', en: 'PRICE', ru: 'ЦЕНА' },
  viewDetails: { tr: 'Detayları Gör', en: 'View Details', ru: 'Подробнее' },
  hoverToMagnify: { tr: 'Büyütmek için üzerine gelin', en: 'Hover to magnify', ru: 'Наведите для увеличения' },
  technicalSpecs: { tr: 'Teknik Özellikler', en: 'Technical Specifications', ru: 'Технические Характеристики' },
  fabricProfile: { tr: 'Kumaş Profili', en: 'Fabric Profile', ru: 'Профиль Ткани' },
  availableColors: { tr: 'Mevcut Renkler', en: 'Available Colors', ru: 'Доступные Цвета' },
  careInstructions: { tr: 'Bakım Talimatları', en: 'Care Instructions', ru: 'Инструкции по Уходу' },
  requestQuote: { tr: 'WhatsApp ile Teklif Al', en: 'Request Quote via WhatsApp', ru: 'Запросить Цену через WhatsApp' },
  minOrder: { tr: 'Minimum sipariş', en: 'Minimum order', ru: 'Минимальный заказ' },
  meters: { tr: 'metre', en: 'meters', ru: 'метров' },
  composition: { tr: 'KOMPOZİSYON', en: 'COMPOSITION', ru: 'СОСТАВ' },
  recommendedUse: { tr: 'ÖNERİLEN KULLANIM', en: 'RECOMMENDED USE', ru: 'РЕКОМЕНДУЕМОЕ ПРИМЕНЕНИЕ' },
  martindale: { tr: 'MARTINDALE', en: 'MARTINDALE', ru: 'МАРТИНДЕЙЛ' },
  lightFast: { tr: 'IŞIK HASLIĞI', en: 'LIGHT FAST', ru: 'СВЕТОСТОЙКОСТЬ' },
  fireRated: { tr: 'YANMAZ', en: 'FIRE RATED', ru: 'ОГНЕСТОЙКИЙ' },
  frCertified: { tr: 'FR Sertifikalı', en: 'FR Certified', ru: 'FR Сертификат' },
  close: { tr: 'Kapat', en: 'Close', ru: 'Закрыть' },
  examine: { tr: 'İncele', en: 'View', ru: 'Смотреть' },
  sort: { tr: 'Sıralama', en: 'Sort By', ru: 'Сортировка' },
  filterSort: { tr: 'Filtre & Sıralama', en: 'Filter & Sort', ru: 'Фильтр и Сортировка' },
  selectCatSort: { tr: 'Kategori ve sıralama seçin', en: 'Select category and sorting', ru: 'Выберите категорию и сортировку' },
  fabricDescription: {
    tr: (name: string, category: string, usage: string, weight: number, width: number) => 
      `${name}, ${usage} için ideal premium bir ${category} kumaştır. ${weight} g/m² ağırlığı ve ${width}cm eni ile bu kumaş mükemmel dayanıklılık ve her iç mekanı yücelten lüks bir his sunar.`,
    en: (name: string, category: string, usage: string, weight: number, width: number) => 
      `${name} is a premium ${category} fabric ideal for ${usage}. With a weight of ${weight} g/m² and ${width}cm width, this fabric offers excellent durability and a luxurious feel that elevates any interior space.`,
    ru: (name: string, category: string, usage: string, weight: number, width: number) => 
      `${name} — это премиальная ткань ${category}, идеальная для ${usage}. С плотностью ${weight} г/м² и шириной ${width}см эта ткань обеспечивает отличную прочность и роскошное ощущение.`
  },
  whatsappMessage: {
    tr: (name: string, sku: string) => `Merhaba, ${name} (${sku}) hakkında bilgi almak istiyorum.`,
    en: (name: string, sku: string) => `Hello, I am interested in ${name} (${sku}).`,
    ru: (name: string, sku: string) => `Здравствуйте, интересует ${name} (${sku}).`
  }
}

// ============================================
// TEXTURE MAGNIFIER COMPONENT
// ============================================
function TextureMagnifier({ 
  src, 
  alt,
  locale
}: { 
  src: string
  alt: string
  locale: Locale
}) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Mouse/Touch pozisyonunu hesapla
  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    
    setPosition({ x, y })
    setLensPosition({
      x: clientX - rect.left,
      y: clientY - rect.top
    })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    updatePosition(e.clientX, e.clientY)
  }, [updatePosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isZoomed) return
    const touch = e.touches[0]
    updatePosition(touch.clientX, touch.clientY)
  }, [isZoomed, updatePosition])

  const hints = {
    desktop: {
      tr: 'Büyütmek için fareyi gezdirin',
      en: 'Hover to magnify',
      ru: 'Наведите для увеличения'
    },
    mobileTap: {
      tr: 'Yakınlaştır',
      en: 'Tap to zoom',
      ru: 'Нажмите'
    },
    mobileDrag: {
      tr: 'Kaydırarak incele',
      en: 'Drag to explore',
      ru: 'Проведите'
    }
  }

  return (
    <div className="relative">
      {/* Ana gorsel container */}
      <div 
        ref={containerRef}
        className="relative aspect-square overflow-hidden bg-slate-100 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsZoomed(true)}
        onTouchEnd={() => setIsZoomed(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Normal goruntu */}
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Zoom overlay - hem mobil hem desktop */}
        {isZoomed && (
          <div 
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: '300%',
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {/* Zoom indicator badge */}
        {isZoomed && (
          <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-slate-900/90 text-white text-xs font-medium rounded">
            3x Zoom
          </div>
        )}

        {/* Crosshair - zoom aktifken */}
        {isZoomed && (
          <div 
            className="absolute z-20 pointer-events-none hidden md:block"
            style={{
              left: lensPosition.x - 1,
              top: lensPosition.y - 1,
              width: 2,
              height: 2,
              boxShadow: '0 0 0 1px white, 0 0 0 2px rgba(0,0,0,0.3)',
            }}
          />
        )}
      </div>

      {/* Alt bilgi cubugu */}
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="flex items-center gap-1.5 text-slate-500">
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="text-xs font-sans">
            <span className="hidden md:inline">{hints.desktop[locale]}</span>
            <span className="md:hidden">{isZoomed ? hints.mobileDrag[locale] : hints.mobileTap[locale]}</span>
          </span>
        </div>
        {isZoomed && (
          <span className="text-xs text-emerald-600 font-medium">
            {locale === 'tr' ? 'Aktif' : locale === 'ru' ? 'Активно' : 'Active'}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// PRODUCT DETAIL DRAWER
// ============================================
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
  
  // Tarayici geri tusu destegi
  useEffect(() => {
    if (isOpen && product) {
      window.history.pushState({ productId: product.id }, '', `?product=${product.sku}`)
      
      const handlePopState = () => {
        onClose()
      }
      
      window.addEventListener('popstate', handlePopState)
      return () => {
        window.removeEventListener('popstate', handlePopState)
      }
    }
  }, [isOpen, product, onClose])
  
  // Kapatma ve URL temizleme
  const handleClose = useCallback(() => {
    window.history.replaceState({}, '', window.location.pathname)
    onClose()
  }, [onClose])
  
  if (!product) return null
  
  const whatsappMessage = encodeURIComponent(labels.whatsappMessage[locale](product.name, product.sku))
  
  const usageText = product.usageAreas.slice(0, 2).map(area => usageAreaLabels[area][locale].toLowerCase()).join(locale === 'tr' ? ' ve ' : locale === 'ru' ? ' и ' : ' and ')
  
  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 bg-white overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pb-8">
            {/* Header with Close Button */}
            <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <SheetTitle className="font-serif text-lg md:text-xl font-medium text-slate-900">
                    {product.name}
                  </SheetTitle>
                  <SheetDescription className="text-[10px] md:text-xs font-sans font-bold tracking-[0.15em] uppercase text-slate-500 mt-1">
                    {categoryLabels[product.category][locale]} | {product.sku}
                  </SheetDescription>
                </div>
                {/* Kapatma Butonu */}
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors rounded"
                  aria-label={labels.close[locale]}
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </SheetHeader>

            {/* Product Image with Magnifier */}
            <div className="p-4">
              <TextureMagnifier 
                src={product.images.primary}
                alt={product.name}
                locale={locale}
              />
            </div>

            {/* Badges */}
            <div className="px-4 pb-4 flex gap-2 flex-wrap">
              {product.new && (
                <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {t.showroom.new}
                </span>
              )}
              {product.bestseller && (
                <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {t.showroom.bestseller}
                </span>
              )}
              {product.fireRetardant && (
                <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {labels.fireRated[locale]}
                </span>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="px-4 pb-6">
              <h3 className="font-serif text-base font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                {labels.technicalSpecs[locale]}
              </h3>
              
              <div className="space-y-0 border border-slate-200">
                {/* Width */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Ruler className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">{labels.width[locale]}</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{product.width} cm</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Weight className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">{labels.gsm[locale]}</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{product.weight} g/m²</span>
                  </div>
                </div>

                {/* Composition */}
                <div className="flex items-center border-b border-slate-200">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Droplets className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">{labels.composition[locale]}</span>
                    <span className="block text-sm font-sans font-light text-slate-900">{formatComposition(product.composition, locale)}</span>
                  </div>
                </div>

                {/* Usage */}
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border-r border-slate-200">
                    <Shirt className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 px-3 md:px-4 py-2.5">
                    <span className="block text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">{labels.recommendedUse[locale]}</span>
                    <span className="block text-sm font-sans font-light text-slate-900">
                      {product.usageAreas.map(area => usageAreaLabels[area][locale]).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Specs */}
              {(product.martindale || product.lightFastness || product.fireRetardant) && (
                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  {product.martindale && (
                    <div className="bg-slate-50 p-2 md:p-3 text-center border border-slate-200">
                      <span className="block text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400">{labels.martindale[locale]}</span>
                      <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{product.martindale.toLocaleString()}</span>
                    </div>
                  )}
                  {product.lightFastness && (
                    <div className="bg-slate-50 p-2 md:p-3 text-center border border-slate-200">
                      <span className="block text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400">{labels.lightFast[locale]}</span>
                      <span className="block text-xs md:text-sm font-sans font-light text-slate-900">{product.lightFastness}/8</span>
                    </div>
                  )}
                  {product.fireRetardant && (
                    <div className="bg-red-50 p-2 md:p-3 text-center border border-red-200">
                      <span className="block text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-wider text-red-400">{labels.fireRated[locale]}</span>
                      <span className="block text-xs md:text-sm font-sans font-light text-red-700">{labels.frCertified[locale]}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fabric Profile */}
            <div className="px-4 pb-6">
              <h3 className="font-serif text-base font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                {labels.fabricProfile[locale]}
              </h3>
              <p className="text-sm font-sans font-light text-slate-600 leading-relaxed">
                {labels.fabricDescription[locale](
                  product.name,
                  categoryLabels[product.category][locale].toLowerCase(),
                  usageText,
                  product.weight,
                  product.width
                )}
              </p>
            </div>

            {/* Colors */}
            <div className="px-4 pb-6">
              <h3 className="font-serif text-base font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                {labels.availableColors[locale]}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((color, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-sans border border-slate-200">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Care Instructions */}
            <div className="px-4 pb-6">
              <h3 className="font-serif text-base font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                {labels.careInstructions[locale]}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.washingInstructions.map((instruction, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-sans border border-slate-200">
                    {washingInstructionLabels[instruction][locale]}
                  </span>
                ))}
              </div>
            </div>

            {/* Request Quote Button */}
            <div className="px-4 pb-4">
              <a
                href={`https://wa.me/905551234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1DA851] text-white py-4 px-6 font-sans font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {labels.requestQuote[locale]}
              </a>
              <p className="mt-3 text-center text-xs font-sans font-light text-slate-500">
                {labels.minOrder[locale]}: {product.minOrder} {labels.meters[locale]}
              </p>
            </div>

            {/* Back button for mobile */}
            <div className="px-4 pb-4 md:hidden">
              <button
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-3 px-6 font-sans text-sm transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.showroom.backToShowroom}
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
function ProductCard({
  product,
  onClick,
  locale,
  index
}: {
  product: FabricProduct
  onClick: () => void
  locale: Locale
  index: number
}) {
  const t = getTranslation(locale)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
      className="group cursor-pointer bg-white border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={product.images.primary}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={index < 8 ? "eager" : "lazy"}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.new && (
            <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {t.showroom.new}
            </span>
          )}
          {product.bestseller && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              {t.showroom.bestseller}
            </span>
          )}
          {product.fireRetardant && (
            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5" />
              FR
            </span>
          )}
        </div>

        {/* SKU Badge */}
        <div className="absolute bottom-2 right-2">
          <span className="px-1.5 py-0.5 bg-white/95 backdrop-blur-sm text-slate-600 text-[8px] font-mono tracking-wider">
            {product.sku}
          </span>
        </div>

        {/* Hover Overlay - Desktop */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-slate-900/40 items-center justify-center hidden md:flex"
        >
          <span className="px-4 py-2 bg-white text-slate-900 text-sm font-sans font-medium tracking-wider uppercase">
            {labels.viewDetails[locale]}
          </span>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        {/* Category */}
        <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-slate-500">
          {categoryLabels[product.category][locale]}
        </span>
        
        {/* Name */}
        <h3 className="mt-0.5 font-serif text-sm md:text-base font-medium text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Quick Specs */}
        <div className="mt-2 grid grid-cols-3 gap-1">
          <div className="bg-slate-50 py-1.5 px-1 text-center border border-slate-100">
            <span className="block text-[7px] md:text-[8px] font-sans font-bold text-slate-400 uppercase tracking-wider">{labels.width[locale]}</span>
            <span className="block text-[10px] md:text-xs font-sans font-light text-slate-900">{product.width}cm</span>
          </div>
          <div className="bg-slate-50 py-1.5 px-1 text-center border border-slate-100">
            <span className="block text-[7px] md:text-[8px] font-sans font-bold text-slate-400 uppercase tracking-wider">{labels.gsm[locale]}</span>
            <span className="block text-[10px] md:text-xs font-sans font-light text-slate-900">{product.weight}</span>
          </div>
          <div className="bg-slate-50 py-1.5 px-1 text-center border border-slate-100">
            <span className="block text-[7px] md:text-[8px] font-sans font-bold text-slate-400 uppercase tracking-wider">{labels.price[locale]}</span>
            <span className="block text-[10px] md:text-xs font-sans font-light text-slate-900">{priceLabels[product.priceCategory]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// SIDEBAR CATEGORIES
// ============================================
function SidebarCategories({
  categories,
  selectedCategory,
  onSelectCategory,
  locale
}: {
  categories: { category: FabricCategory | 'all'; count: number }[]
  selectedCategory: FabricCategory | 'all'
  onSelectCategory: (cat: FabricCategory | 'all') => void
  locale: Locale
}) {
  const t = getTranslation(locale)

  return (
    <div className="space-y-1">
      {categories.map(({ category, count }) => {
        const isActive = selectedCategory === category
        const label = category === 'all' 
          ? t.showroom.allCategories
          : categoryLabels[category]?.[locale] || category

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-all ${
              isActive 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="font-sans text-sm">{label}</span>
            <span className={`text-xs font-mono ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ============================================
// MOBILE FILTER SHEET
// ============================================
function MobileFilterSheet({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  locale
}: {
  isOpen: boolean
  onClose: () => void
  categories: { category: FabricCategory | 'all'; count: number }[]
  selectedCategory: FabricCategory | 'all'
  onSelectCategory: (cat: FabricCategory | 'all') => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
  locale: Locale
}) {
  const t = getTranslation(locale)
  
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: t.showroom.sortOptions.nameAsc },
    { value: 'name-desc', label: t.showroom.sortOptions.nameDesc },
    { value: 'weight-asc', label: t.showroom.sortOptions.weightAsc },
    { value: 'weight-desc', label: t.showroom.sortOptions.weightDesc },
    { value: 'price-asc', label: t.showroom.sortOptions.priceAsc },
    { value: 'price-desc', label: t.showroom.sortOptions.priceDesc },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0 bg-white">
        <SheetHeader className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-lg">{t.showroom.filters}</SheetTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <SheetDescription className="text-xs text-slate-500">
            {labels.selectCatSort[locale]}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4">
            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {t.showroom.category}
              </h4>
              <SidebarCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  onSelectCategory(cat)
                  onClose()
                }}
                locale={locale}
              />
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {labels.sort[locale]}
              </h4>
              <div className="space-y-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      onClose()
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                      sortOption === option.value
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ============================================
// LANGUAGE SELECTOR
// ============================================
function LanguageSelector({
  locale,
  onLocaleChange
}: {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'tr' as Locale, label: 'Türkçe', flag: 'TR' },
    { code: 'en' as Locale, label: 'English', flag: 'EN' },
    { code: 'ru' as Locale, label: 'Русский', flag: 'RU' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-sans font-medium uppercase">{locale}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-1 bg-white border border-slate-200 shadow-lg z-50 min-w-[140px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLocaleChange(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    locale === lang.code 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono text-xs">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// MAIN SHOWROOM PAGE
// ============================================
export default function ShowroomPage() {
  // Dil state - Turkce varsayilan
  const [locale, setLocale] = useState<Locale>('tr')
  const t = getTranslation(locale)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FabricCategory | 'all'>('all')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')

  // UI states
  const [selectedProduct, setSelectedProduct] = useState<FabricProduct | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Scroll pozisyonu kaydetme
  const scrollPositionRef = useRef(0)

  // Scroll top butonunu goster/gizle
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Kategorileri hesapla
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FABRIC_DATA.length }
    FABRIC_DATA.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    
    const categories = getCategories()
    return [
      { category: 'all' as const, count: counts.all },
      ...categories.map(cat => ({
        category: cat,
        count: counts[cat] || 0
      }))
    ]
  }, [])

  // Filtreleme ve siralama
  const filteredProducts = useMemo(() => {
    let result = [...FABRIC_DATA]
    
    // Kategori filtresi
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }
    
    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.pattern && p.pattern.toLowerCase().includes(query))
      )
    }
    
    // Siralama
    result.sort((a, b) => {
      switch (sortOption) {
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
    
    return result
  }, [selectedCategory, searchQuery, sortOption])

  // Urun tiklamasi - scroll pozisyonu kaydet
  const handleProductClick = useCallback((product: FabricProduct) => {
    scrollPositionRef.current = window.scrollY
    setSelectedProduct(product)
    setIsDrawerOpen(true)
  }, [])
  
  // Drawer kapatma - scroll pozisyonunu geri yukle
  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false)
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' })
    })
  }, [])

  // Yukari kaydir
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-lg md:text-xl font-medium tracking-tight text-slate-900">
                KARACA BEY
              </span>
            </Link>
          </div>

          {/* Center: Title (desktop) */}
          <div className="hidden md:block">
            <h1 className="font-serif text-sm font-medium text-slate-600 tracking-wider uppercase">
              {t.showroom.title}
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <LanguageSelector locale={locale} onLocaleChange={setLocale} />
            
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-sans">{t.showroom.home}</span>
            </Link>
            
            <a
              href="tel:+905551234567"
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-sans">{t.showroom.contact}</span>
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 lg:px-6 pb-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.showroom.search}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 bg-white">
          <div className="sticky top-[120px] p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              {t.showroom.category}
            </h2>
            <SidebarCategories
              categories={categoriesWithCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              locale={locale}
            />

            {/* Sort Options - Desktop */}
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {labels.sort[locale]}
              </h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm text-slate-700 font-sans focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="name-asc">{t.showroom.sortOptions.nameAsc}</option>
                <option value="name-desc">{t.showroom.sortOptions.nameDesc}</option>
                <option value="weight-asc">{t.showroom.sortOptions.weightAsc}</option>
                <option value="weight-desc">{t.showroom.sortOptions.weightDesc}</option>
                <option value="price-asc">{t.showroom.sortOptions.priceAsc}</option>
                <option value="price-desc">{t.showroom.sortOptions.priceDesc}</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 min-w-0">
          {/* Results count */}
          <div className="px-4 lg:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-600 font-sans">
              <span className="font-semibold text-slate-900">{filteredProducts.length}</span> {t.showroom.products}
            </p>
            
            {/* Mobile sort button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <span>{labels.filterSort[locale]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Grid */}
          <div className="p-4 lg:p-6">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product)}
                      locale={locale}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-serif text-lg text-slate-900 mb-2">{t.showroom.noProducts}</h3>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900 underline"
                >
                  {t.showroom.resetFilters}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center z-50 transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categoriesWithCounts}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortOption={sortOption}
        onSortChange={setSortOption}
        locale={locale}
      />

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        locale={locale}
      />
    </div>
  )
}
