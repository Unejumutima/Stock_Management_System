export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type InventoryRow = {
  id: string
  name: string
  sku: string
  category: string
  purchased: number
  sold: number
  current: number
  status: StockStatus
}

export const INVENTORY_ROWS: InventoryRow[] = [
  {
    id: '1',
    name: 'West African Cocoa — Grade A',
    sku: 'ZHS-COC-104',
    category: 'Commodities',
    purchased: 3200,
    sold: 2760,
    current: 440,
    status: 'in_stock',
  },
  {
    id: '2',
    name: 'Cold-pressed Palm Olein (20L)',
    sku: 'ZHS-OLE-088',
    category: 'Oils & Fats',
    purchased: 1800,
    sold: 1620,
    current: 180,
    status: 'in_stock',
  },
  {
    id: '3',
    name: 'Premium Basmati Rice (25kg)',
    sku: 'ZHS-RIC-212',
    category: 'Grains',
    purchased: 2400,
    sold: 2310,
    current: 90,
    status: 'low_stock',
  },
  {
    id: '4',
    name: 'Sunflower Cooking Oil (5L)',
    sku: 'ZHS-OIL-031',
    category: 'Oils & Fats',
    purchased: 1500,
    sold: 1380,
    current: 120,
    status: 'in_stock',
  },
  {
    id: '5',
    name: 'Granulated Sugar (50kg)',
    sku: 'ZHS-SUG-017',
    category: 'Sweeteners',
    purchased: 980,
    sold: 980,
    current: 0,
    status: 'out_of_stock',
  },
  {
    id: '6',
    name: 'Dried Catfish (Carton)',
    sku: 'ZHS-FSH-042',
    category: 'Protein',
    purchased: 640,
    sold: 598,
    current: 42,
    status: 'low_stock',
  },
  {
    id: '7',
    name: 'Tomato Paste (70g × 48)',
    sku: 'ZHS-TOM-055',
    category: 'Packaged Goods',
    purchased: 2200,
    sold: 1890,
    current: 310,
    status: 'in_stock',
  },
  {
    id: '8',
    name: 'Maize Flour (10kg)',
    sku: 'ZHS-MAZ-019',
    category: 'Grains',
    purchased: 1100,
    sold: 1045,
    current: 55,
    status: 'low_stock',
  },
]

export const INVENTORY_CATEGORIES = ['All categories', 'Commodities', 'Oils & Fats', 'Grains', 'Sweeteners', 'Protein', 'Packaged Goods']

export const STOCK_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
] as const

export const STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
}

export const STATUS_BADGE_CLASS: Record<StockStatus, string> = {
  in_stock: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  low_stock: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  out_of_stock: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

export const RECENT_UPDATES = [
  { product: 'Tomato Paste (70g × 48)', action: 'Stock adjusted +120 units', time: '12 min ago' },
  { product: 'Premium Basmati Rice (25kg)', action: 'Purchase order received', time: '1 hr ago' },
  { product: 'Granulated Sugar (50kg)', action: 'Marked out of stock', time: '3 hrs ago' },
]

export const LOW_STOCK_ALERTS = [
  { product: 'Granulated Sugar (50kg)', sku: 'ZHS-SUG-017', remaining: 0 },
  { product: 'Maize Flour (10kg)', sku: 'ZHS-MAZ-019', remaining: 55 },
  { product: 'Premium Basmati Rice (25kg)', sku: 'ZHS-RIC-212', remaining: 90 },
]
