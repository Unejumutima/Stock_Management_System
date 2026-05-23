import * as inventoryModel from '../models/inventory.model.js'
import { mapProduct } from '../utils/transform.js'

function mapInventoryRow(row) {
  const item = mapProduct(row)
  item.status = row.status
  item.inventoryValue = Number(row.inventory_value)
  return item
}

export async function listInventory(query) {
  const rows = await inventoryModel.findInventoryList({
    search: query.search,
    category: query.category,
    lowStockThreshold: query.lowStockThreshold ? Number(query.lowStockThreshold) : 75,
  })
  return rows.map(mapInventoryRow)
}

export async function getLowStock(query) {
  const threshold = query.threshold ? Number(query.threshold) : 75
  const rows = await inventoryModel.findLowStock(threshold)
  return rows.map(mapInventoryRow)
}

export async function getInventoryOverview() {
  const totals = await inventoryModel.getInventoryTotals()
  return {
    productCount: Number(totals.product_count),
    totalUnits: Number(totals.total_units),
    totalInventoryValue: Number(totals.total_inventory_value),
    outOfStockCount: Number(totals.out_of_stock_count),
    lowStockCount: Number(totals.low_stock_count),
  }
}
