import { ApiError } from '../utils/ApiError.js'
import * as purchaseModel from '../models/purchase.model.js'
import * as productModel from '../models/product.model.js'
import { mapPurchase } from '../utils/transform.js'

export async function listPurchases(query) {
  const rows = await purchaseModel.findAll({
    productId: query.productId,
    category: query.category,
    from: query.from,
    to: query.to,
    search: query.search,
  })
  return rows.map(mapPurchase)
}

export async function getPurchase(id) {
  const row = await purchaseModel.findById(id)
  if (!row) throw ApiError.notFound('Purchase not found')
  return mapPurchase(row)
}

export async function createPurchase(body) {
  const product = await productModel.findById(body.productId)
  if (!product) throw ApiError.notFound('Product not found')

  const row = await purchaseModel.create({
    productId: body.productId,
    quantity: body.quantity,
    pricePerUnit: body.pricePerUnit,
    purchaseDate: body.purchaseDate,
  })
  return mapPurchase(row)
}

export async function getPurchaseSummary(query) {
  const summary = await purchaseModel.getSummary({ from: query.from, to: query.to })
  return {
    totalPurchases: Number(summary.total_purchases),
    totalUnits: Number(summary.total_units),
    totalCost: Number(summary.total_cost),
  }
}

export async function deletePurchase(id) {
  const deleted = await purchaseModel.remove(id)
  if (!deleted) throw ApiError.notFound('Purchase not found')
}
