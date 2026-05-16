export type StockLevel = 'high' | 'medium' | 'low'

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stock: number
}

export const PRODUCT_CATEGORIES = [
  'All categories',
  'Commodities',
  'Oils & Fats',
  'Grains',
  'Sweeteners',
  'Protein',
  'Packaged Goods',
] as const

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'stock-desc', label: 'Stock (high to low)' },
  { value: 'stock-asc', label: 'Stock (low to high)' },
  { value: 'price-desc', label: 'Selling price (high to low)' },
  { value: 'price-asc', label: 'Selling price (low to high)' },
] as const

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'West African Cocoa — Grade A',
    sku: 'ZHS-COC-104',
    category: 'Commodities',
    purchasePrice: 18.4,
    sellingPrice: 24.9,
    stock: 440,
  },
  {
    id: '2',
    name: 'Cold-pressed Palm Olein (20L)',
    sku: 'ZHS-OLE-088',
    category: 'Oils & Fats',
    purchasePrice: 42.0,
    sellingPrice: 56.5,
    stock: 180,
  },
  {
    id: '3',
    name: 'Premium Basmati Rice (25kg)',
    sku: 'ZHS-RIC-212',
    category: 'Grains',
    purchasePrice: 28.75,
    sellingPrice: 36.0,
    stock: 90,
  },
  {
    id: '4',
    name: 'Sunflower Cooking Oil (5L)',
    sku: 'ZHS-OIL-031',
    category: 'Oils & Fats',
    purchasePrice: 11.2,
    sellingPrice: 15.8,
    stock: 120,
  },
  {
    id: '5',
    name: 'Granulated Sugar (50kg)',
    sku: 'ZHS-SUG-017',
    category: 'Sweeteners',
    purchasePrice: 32.5,
    sellingPrice: 41.0,
    stock: 0,
  },
  {
    id: '6',
    name: 'Dried Catfish (Carton)',
    sku: 'ZHS-FSH-042',
    category: 'Protein',
    purchasePrice: 24.0,
    sellingPrice: 31.5,
    stock: 42,
  },
  {
    id: '7',
    name: 'Tomato Paste (70g × 48)',
    sku: 'ZHS-TOM-055',
    category: 'Packaged Goods',
    purchasePrice: 19.8,
    sellingPrice: 26.4,
    stock: 310,
  },
  {
    id: '8',
    name: 'Maize Flour (10kg)',
    sku: 'ZHS-MAZ-019',
    category: 'Grains',
    purchasePrice: 8.6,
    sellingPrice: 11.25,
    stock: 55,
  },
]

export function getStockLevel(stock: number): StockLevel {
  if (stock < 75) return 'low'
  if (stock < 250) return 'medium'
  return 'high'
}

export const STOCK_LEVEL_CLASS: Record<StockLevel, string> = {
  high: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  medium: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  low: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}
