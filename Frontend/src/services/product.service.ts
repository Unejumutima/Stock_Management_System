/**
 * Product service — wraps all calls to GET/POST/PUT/DELETE /api/products
 * Product IDs are UUID strings (PostgreSQL UUID primary key).
 */
import api from '../utils/api'

export interface Product {
  id: string   // UUID
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stock: number
}

export interface CreateProductPayload {
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  initialStock?: number   // optional: creates an opening purchase record
}

export interface UpdateProductPayload extends Partial<Omit<CreateProductPayload, 'initialStock'>> {}

export async function fetchProducts(params?: { search?: string; category?: string }): Promise<Product[]> {
  const { data } = await api.get('/products', { params })
  return data.data.products
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await api.post('/products', payload)
  return data.data.product
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, payload)
  return data.data.product
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`)
}
