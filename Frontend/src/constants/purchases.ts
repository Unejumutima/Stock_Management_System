export type Purchase = {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  quantity: number
  pricePerUnit: number
  purchaseDate: string
}

export function purchaseTotalCost(row: Pick<Purchase, 'quantity' | 'pricePerUnit'>): number {
  return row.quantity * row.pricePerUnit
}

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'pur-1',
    productId: '1',
    productName: 'West African Cocoa — Grade A',
    sku: 'ZHS-COC-104',
    category: 'Commodities',
    quantity: 200,
    pricePerUnit: 18.4,
    purchaseDate: '2026-05-02',
  },
  {
    id: 'pur-2',
    productId: '3',
    productName: 'Premium Basmati Rice (25kg)',
    sku: 'ZHS-RIC-212',
    category: 'Grains',
    quantity: 60,
    pricePerUnit: 28.75,
    purchaseDate: '2026-05-04',
  },
  {
    id: 'pur-3',
    productId: '2',
    productName: 'Cold-pressed Palm Olein (20L)',
    sku: 'ZHS-OLE-088',
    category: 'Oils & Fats',
    quantity: 80,
    pricePerUnit: 42.0,
    purchaseDate: '2026-05-06',
  },
  {
    id: 'pur-4',
    productId: '7',
    productName: 'Tomato Paste (70g × 48)',
    sku: 'ZHS-TOM-055',
    category: 'Packaged Goods',
    quantity: 150,
    pricePerUnit: 19.8,
    purchaseDate: '2026-05-08',
  },
  {
    id: 'pur-5',
    productId: '5',
    productName: 'Granulated Sugar (50kg)',
    sku: 'ZHS-SUG-017',
    category: 'Sweeteners',
    quantity: 40,
    pricePerUnit: 32.5,
    purchaseDate: '2026-05-10',
  },
  {
    id: 'pur-6',
    productId: '4',
    productName: 'Sunflower Cooking Oil (5L)',
    sku: 'ZHS-OIL-031',
    category: 'Oils & Fats',
    quantity: 100,
    pricePerUnit: 11.2,
    purchaseDate: '2026-05-12',
  },
  {
    id: 'pur-7',
    productId: '6',
    productName: 'Dried Catfish (Carton)',
    sku: 'ZHS-FSH-042',
    category: 'Protein',
    quantity: 35,
    pricePerUnit: 24.0,
    purchaseDate: '2026-05-14',
  },
  {
    id: 'pur-8',
    productId: '8',
    productName: 'Maize Flour (10kg)',
    sku: 'ZHS-MAZ-019',
    category: 'Grains',
    quantity: 75,
    pricePerUnit: 8.6,
    purchaseDate: '2026-04-22',
  },
]
