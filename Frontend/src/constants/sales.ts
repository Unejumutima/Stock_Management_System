export type Sale = {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  quantity: number
  sellingPrice: number
  saleDate: string
}

export function saleTotalRevenue(row: Pick<Sale, 'quantity' | 'sellingPrice'>): number {
  return row.quantity * row.sellingPrice
}

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sal-1',
    productId: '1',
    productName: 'West African Cocoa — Grade A',
    sku: 'ZHS-COC-104',
    category: 'Commodities',
    quantity: 85,
    sellingPrice: 24.9,
    saleDate: '2026-05-03',
  },
  {
    id: 'sal-2',
    productId: '3',
    productName: 'Premium Basmati Rice (25kg)',
    sku: 'ZHS-RIC-212',
    category: 'Grains',
    quantity: 42,
    sellingPrice: 36.0,
    saleDate: '2026-05-05',
  },
  {
    id: 'sal-3',
    productId: '2',
    productName: 'Cold-pressed Palm Olein (20L)',
    sku: 'ZHS-OLE-088',
    category: 'Oils & Fats',
    quantity: 28,
    sellingPrice: 56.5,
    saleDate: '2026-05-07',
  },
  {
    id: 'sal-4',
    productId: '7',
    productName: 'Tomato Paste (70g × 48)',
    sku: 'ZHS-TOM-055',
    category: 'Packaged Goods',
    quantity: 120,
    sellingPrice: 26.4,
    saleDate: '2026-05-09',
  },
  {
    id: 'sal-5',
    productId: '4',
    productName: 'Sunflower Cooking Oil (5L)',
    sku: 'ZHS-OIL-031',
    category: 'Oils & Fats',
    quantity: 65,
    sellingPrice: 15.8,
    saleDate: '2026-05-11',
  },
  {
    id: 'sal-6',
    productId: '6',
    productName: 'Dried Catfish (Carton)',
    sku: 'ZHS-FSH-042',
    category: 'Protein',
    quantity: 18,
    sellingPrice: 31.5,
    saleDate: '2026-05-13',
  },
  {
    id: 'sal-7',
    productId: '8',
    productName: 'Maize Flour (10kg)',
    sku: 'ZHS-MAZ-019',
    category: 'Grains',
    quantity: 50,
    sellingPrice: 11.25,
    saleDate: '2026-05-15',
  },
  {
    id: 'sal-8',
    productId: '1',
    productName: 'West African Cocoa — Grade A',
    sku: 'ZHS-COC-104',
    category: 'Commodities',
    quantity: 40,
    sellingPrice: 24.9,
    saleDate: '2026-04-18',
  },
]
