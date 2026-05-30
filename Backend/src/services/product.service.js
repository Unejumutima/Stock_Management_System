import { ApiError } from '../utils/ApiError.js'
import * as productModel from '../models/product.model.js'
import * as purchaseModel from '../models/purchase.model.js'
import { mapProduct } from '../utils/transform.js'

export async function listProducts(query) {
  const rows = await productModel.findAll({
    search: query.search,
    category: query.category,
  })
  return rows.map(mapProduct)
}

export async function getProduct(id) {
  const row = await productModel.findById(id)
  if (!row) throw ApiError.notFound('Product not found')
  return mapProduct(row)
}

export async function createProduct(body) {
  const product = await productModel.create({
    name: body.name,
    sku: body.sku,
    category: body.category,
    purchasePrice: body.purchasePrice,
    sellingPrice: body.sellingPrice,
  })

  // If an initial stock quantity is provided, create an opening purchase record
  // so the stock calculation (purchases - sales) reflects the starting inventory.
  if (body.initialStock && Number(body.initialStock) > 0) {
    const today = new Date().toISOString().split('T')[0]
    await purchaseModel.create({
      productId: product.id,
      quantity: Number(body.initialStock),
      pricePerUnit: body.purchasePrice,
      purchaseDate: today,
    })
    // Re-fetch so the returned product has the correct stock value
    return mapProduct(await productModel.findById(product.id))
  }

  return mapProduct(product)
}

export async function updateProduct(id, body) {
  const existing = await productModel.findById(id)
  if (!existing) throw ApiError.notFound('Product not found')
  const product = await productModel.update(id, body)
  return mapProduct(product)
}

export async function deleteProduct(id) {
  const deleted = await productModel.remove(id)
  if (!deleted) throw ApiError.notFound('Product not found')
  return true
}
