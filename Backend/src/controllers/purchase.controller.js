import * as purchaseService from '../services/purchase.service.js'
import { sendSuccess, sendCreated, sendMessage } from '../utils/response.js'

export async function getPurchases(req, res) {
  const purchases = await purchaseService.listPurchases(req.query)
  return sendSuccess(res, { purchases })
}

export async function getPurchase(req, res) {
  const purchase = await purchaseService.getPurchase(req.params.id)
  return sendSuccess(res, { purchase })
}

export async function createPurchase(req, res) {
  const purchase = await purchaseService.createPurchase(req.body)
  return sendCreated(res, { purchase })
}

export async function getPurchaseSummary(req, res) {
  const summary = await purchaseService.getPurchaseSummary(req.query)
  return sendSuccess(res, { summary })
}

export async function deletePurchase(req, res) {
  await purchaseService.deletePurchase(req.params.id)
  return sendMessage(res, 'Purchase deleted successfully')
}
