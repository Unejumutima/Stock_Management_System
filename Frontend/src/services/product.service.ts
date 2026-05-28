/**
 * Product service — wraps all calls to GET/POST/PUT/DELETE /api/products
 * The axios instance in utils/api.ts automatically attaches the JWT token.
 */
import api from '../utils/api'

export interface Product {
  id: number
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
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

/** Fetch all products, optionally filtered by search string or category */
export async function fetchProducts(params?: { search?: string; category?: string }): Promise<Product[]> {
  const { data } = await api.get('/products', { params })
  return data.data.products
}

/** Create a new product */
export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await api.post('/products', payload)
  return data.data.product
}

/** Update an existing product by id */
export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, payload)
  return data.data.product
}

/** Delete a product by id */
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`)
}
