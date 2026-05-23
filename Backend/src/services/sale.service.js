import { ApiError } from '../utils/ApiError.js'
import * as saleModel from '../models/sale.model.js'
import * as productModel from '../models/product.model.js'
import { mapSale } from '../utils/transform.js'

export async function listSales(query) {
  const rows = await saleModel.findAll({
    productId: query.productId,
    category: query.category,
    from: query.from,
    to: query.to,
    search: query.search,
  })
  return rows.map(mapSale)
}

export async function getSale(id) {
  const row = await saleModel.findById(id)
  if (!row) throw ApiError.notFound('Sale not found')
  return mapSale(row)
}

export async function createSale(body) {
  const product = await productModel.findById(body.productId)
  if (!product) throw ApiError.notFound('Product not found')

  const stock = Number(product.stock)
  if (body.quantity > stock) {
    throw ApiError.badRequest(`Insufficient stock. Available: ${stock}, requested: ${body.quantity}`)
  }

  const row = await saleModel.create({
    productId: body.productId,
    quantity: body.quantity,
    saleDate: body.saleDate,
  })
  return mapSale(row)
}

export async function getSaleSummary(query) {
  const summary = await saleModel.getSummary({ from: query.from, to: query.to })
  return {
    totalSales: Number(summary.total_sales),
    totalUnits: Number(summary.total_units),
    totalRevenue: Number(summary.total_revenue),
    totalCost: Number(summary.total_cost),
    grossProfit: Number(summary.gross_profit),
  }
}

export async function deleteSale(id) {
  const deleted = await saleModel.remove(id)
  if (!deleted) throw ApiError.notFound('Sale not found')
}
