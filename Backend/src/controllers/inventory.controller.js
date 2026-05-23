import * as inventoryService from '../services/inventory.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getInventory(req, res) {
  const items = await inventoryService.listInventory(req.query)
  return sendSuccess(res, { items })
}

export async function getLowStock(req, res) {
  const items = await inventoryService.getLowStock(req.query)
  return sendSuccess(res, { items })
}

export async function getInventoryOverview(req, res) {
  const overview = await inventoryService.getInventoryOverview()
  return sendSuccess(res, { overview })
}
