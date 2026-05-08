export type FabricCategory = 
  | 'velvet' 
  | 'satin' 
  | 'linen' 
  | 'jacquard' 
  | 'silk' 
  | 'tablecloth'
  | 'chenille'
  | 'organza'
  | 'taffeta'
  | 'brocade'
  | 'damask'
  | 'suede'

export interface FabricSpecs {
  width: string
  weight: string
  composition: string
  usage: string[]
  careInstructions: string[]
  colors: string[]
  minOrder: string
  priceRange: string
}

export interface Fabric {
  id: FabricCategory
  image: string
  specs: FabricSpecs
}

export const fabrics: Record<FabricCategory, Fabric> = {
  velvet: {
    id: 'velvet',
    image: '/images/fabric-velvet.jpg',
    specs: {
      width: '280 cm',
      weight: '350 g/m²',
      composition: '100% Polyester',
      usage: ['Curtains', 'Upholstery', 'Cushions', 'Headboards'],
      careInstructions: ['Dry clean recommended', 'Do not bleach', 'Iron on low heat'],
      colors: ['Emerald', 'Burgundy', 'Navy', 'Gold', 'Ivory', 'Charcoal'],
      minOrder: '50 meters',
      priceRange: '$$$$',
    },
  },
  satin: {
    id: 'satin',
    image: '/images/fabric-satin.jpg',
    specs: {
      width: '300 cm',
      weight: '180 g/m²',
      composition: '85% Polyester, 15% Viscose',
      usage: ['Bedding', 'Curtains', 'Event Decor', 'Table Runners'],
      careInstructions: ['Machine wash 30°C', 'Do not tumble dry', 'Iron on medium'],
      colors: ['Champagne', 'Silver', 'Blush', 'Pearl', 'Midnight', 'Rose Gold'],
      minOrder: '30 meters',
      priceRange: '$$$',
    },
  },
  linen: {
    id: 'linen',
    image: '/images/fabric-linen.jpg',
    specs: {
      width: '150 cm',
      weight: '220 g/m²',
      composition: '100% Belgian Linen',
      usage: ['Tablecloths', 'Napkins', 'Curtains', 'Bedding'],
      careInstructions: ['Machine wash 40°C', 'Tumble dry low', 'Iron while damp'],
      colors: ['Natural', 'White', 'Oatmeal', 'Sage', 'Dusty Blue', 'Terracotta'],
      minOrder: '25 meters',
      priceRange: '$$$',
    },
  },
  jacquard: {
    id: 'jacquard',
    image: '/images/fabric-jacquard.jpg',
    specs: {
      width: '280 cm',
      weight: '400 g/m²',
      composition: '70% Cotton, 30% Polyester',
      usage: ['Upholstery', 'Curtains', 'Tablecloths', 'Decorative Pillows'],
      careInstructions: ['Dry clean only', 'Do not bleach', 'Professional iron'],
      colors: ['Navy/Gold', 'Cream/Silver', 'Burgundy/Bronze', 'Forest/Copper'],
      minOrder: '40 meters',
      priceRange: '$$$$',
    },
  },
  silk: {
    id: 'silk',
    image: '/images/fabric-silk.jpg',
    specs: {
      width: '140 cm',
      weight: '90 g/m²',
      composition: '65% Silk, 35% Cotton',
      usage: ['Curtains', 'Decorative Panels', 'Luxury Bedding', 'Special Events'],
      careInstructions: ['Dry clean only', 'Store away from sunlight', 'Professional care'],
      colors: ['Ivory', 'Blush', 'Champagne', 'Dove Grey', 'Soft Gold'],
      minOrder: '20 meters',
      priceRange: '$$$$$',
    },
  },
  tablecloth: {
    id: 'tablecloth',
    image: '/images/fabric-table.jpg',
    specs: {
      width: '180 cm / 320 cm',
      weight: '280 g/m²',
      composition: '60% Cotton, 40% Polyester',
      usage: ['Dining Tables', 'Banquet Tables', 'Hotel & Restaurant', 'Events'],
      careInstructions: ['Machine wash 60°C', 'Tumble dry medium', 'Iron on high'],
      colors: ['White', 'Ivory', 'Ecru', 'Silver Grey', 'Champagne'],
      minOrder: '20 meters',
      priceRange: '$$',
    },
  },
  chenille: {
    id: 'chenille',
    image: '/images/fabric-chenille.jpg',
    specs: {
      width: '280 cm',
      weight: '450 g/m²',
      composition: '100% Polyester Chenille',
      usage: ['Sofas', 'Armchairs', 'Cushions', 'Throws'],
      careInstructions: ['Dry clean recommended', 'Spot clean with mild detergent', 'Brush gently'],
      colors: ['Taupe', 'Sage', 'Dusty Rose', 'Slate', 'Cream', 'Terracotta'],
      minOrder: '40 meters',
      priceRange: '$$$',
    },
  },
  organza: {
    id: 'organza',
    image: '/images/fabric-organza.jpg',
    specs: {
      width: '300 cm',
      weight: '45 g/m²',
      composition: '100% Polyester Organza',
      usage: ['Sheer Curtains', 'Event Decor', 'Wedding Decor', 'Overlays'],
      careInstructions: ['Hand wash cold', 'Hang to dry', 'Iron on low with cloth'],
      colors: ['Crystal', 'Champagne', 'Blush', 'Lavender', 'Mint', 'Gold'],
      minOrder: '50 meters',
      priceRange: '$$',
    },
  },
  taffeta: {
    id: 'taffeta',
    image: '/images/fabric-taffeta.jpg',
    specs: {
      width: '150 cm',
      weight: '120 g/m²',
      composition: '100% Polyester Taffeta',
      usage: ['Curtain Linings', 'Event Tablecloths', 'Chair Covers', 'Decorative Bows'],
      careInstructions: ['Machine wash 30°C', 'Do not tumble dry', 'Iron on medium'],
      colors: ['Bronze', 'Burgundy', 'Hunter Green', 'Royal Blue', 'Gold', 'Silver'],
      minOrder: '30 meters',
      priceRange: '$$',
    },
  },
  brocade: {
    id: 'brocade',
    image: '/images/fabric-brocade.jpg',
    specs: {
      width: '140 cm',
      weight: '320 g/m²',
      composition: '55% Silk, 45% Metallic Thread',
      usage: ['Upholstery', 'Wall Panels', 'Decorative Cushions', 'Ceremonial'],
      careInstructions: ['Dry clean only', 'Avoid direct sunlight', 'Professional storage'],
      colors: ['Gold/Burgundy', 'Silver/Navy', 'Bronze/Emerald', 'Ivory/Gold'],
      minOrder: '15 meters',
      priceRange: '$$$$$',
    },
  },
  damask: {
    id: 'damask',
    image: '/images/fabric-damask.jpg',
    specs: {
      width: '280 cm',
      weight: '350 g/m²',
      composition: '80% Cotton, 20% Silk',
      usage: ['Tablecloths', 'Napkins', 'Curtains', 'Bedding'],
      careInstructions: ['Machine wash 40°C', 'Tumble dry low', 'Iron while damp'],
      colors: ['White', 'Ivory', 'Champagne', 'Blush', 'Sage'],
      minOrder: '25 meters',
      priceRange: '$$$$',
    },
  },
  suede: {
    id: 'suede',
    image: '/images/fabric-suede.jpg',
    specs: {
      width: '140 cm',
      weight: '280 g/m²',
      composition: '100% Microfiber Suede',
      usage: ['Sofas', 'Headboards', 'Wall Panels', 'Cushions'],
      careInstructions: ['Dry clean only', 'Brush regularly', 'Protect from moisture'],
      colors: ['Camel', 'Charcoal', 'Olive', 'Burgundy', 'Navy', 'Stone'],
      minOrder: '30 meters',
      priceRange: '$$$',
    },
  },
}

export const fabricCategories = Object.keys(fabrics) as FabricCategory[]

// Group fabrics by type for gallery display
export const fabricGroups = {
  luxury: ['velvet', 'silk', 'brocade'] as FabricCategory[],
  everyday: ['satin', 'linen', 'tablecloth', 'damask'] as FabricCategory[],
  upholstery: ['chenille', 'jacquard', 'suede'] as FabricCategory[],
  sheer: ['organza', 'taffeta'] as FabricCategory[],
}
