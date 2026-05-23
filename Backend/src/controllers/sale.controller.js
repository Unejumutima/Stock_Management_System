import * as saleService from '../services/sale.service.js'
import { sendSuccess, sendCreated, sendMessage } from '../utils/response.js'

export async function getSales(req, res) {
  const sales = await saleService.listSales(req.query)
  return sendSuccess(res, { sales })
}

export async function getSale(req, res) {
  const sale = await saleService.getSale(req.params.id)
  return sendSuccess(res, { sale })
}

export async function createSale(req, res) {
  const sale = await saleService.createSale(req.body)
  return sendCreated(res, { sale })
}

export async function getSaleSummary(req, res) {
  const summary = await saleService.getSaleSummary(req.query)
  return sendSuccess(res, { summary })
}

export async function deleteSale(req, res) {
  await saleService.deleteSale(req.params.id)
  return sendMessage(res, 'Sale deleted successfully')
}
